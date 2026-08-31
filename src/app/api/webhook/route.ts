import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import { streamVideoClient } from "@/lib/stream-video";
import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
  MessageNewEvent,
} from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideoClient.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or api key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload?.type;

  // 1. Session Started: Connect Realtime Agent
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId =
      event.call.custom?.meetingId || event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!existingMeeting || !existingMeeting.agentId) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (existingMeeting.status !== "active") {
      await db
        .update(meetings)
        .set({ status: "active", startedAt: new Date() })
        .where(eq(meetings.id, existingMeeting.id));
    }

    const avatarUrl = generateAvatarUri({
      seed: existingAgent.name,
      variant: "botttsNeutral",
    });

    await streamVideoClient.upsertUsers([
      {
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
        role: "admin",
      },
    ]);

    const call = streamVideoClient.video.call("default", meetingId);

    try {
      await (call as any).join?.({ create: true });

      const realtimeClient = await streamVideoClient.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY || "",
        agentUserId: existingAgent.id,
      });

      realtimeClient.updateSession({
        instructions: `You are an AI interviewer named ${existingAgent.name}. ${existingAgent.instructions}. Speak naturally and greet the candidate first.`,
        voice: "alloy",
      });

      realtimeClient.on("error", (err: any) => console.error("[Realtime Error]:", err));
    } catch (err: any) {
      console.error("[Realtime Connect Error]:", err.message);
    }
  }

  // 2. Participant Left
  else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    const participantUserId = event.participant?.user?.id;

    if (meetingId) {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, meetingId));

      if (existingMeeting && existingMeeting.agentId === participantUserId) {
        return NextResponse.json({ status: "ok" });
      }

      await db
        .update(meetings)
        .set({ status: "processing", endedAt: new Date() })
        .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
    }
  }

  // 3. Transcription Ready
  else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updateMeeting] = await db
      .update(meetings)
      .set({ transcriptUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (updateMeeting) {
      await inngest.send({
        name: "meetings/processing",
        data: {
          meetingId: updateMeeting.id,
          transcriptUrl: updateMeeting.transcriptUrl,
        },
      });
    }
  }

  // 4. Recording Ready
  else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(eq(meetings.id, meetingId))
      .returning();
  }

  // 5. Post-call chat message with Groq
  else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;
    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (userId && channelId && text) {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

      if (existingMeeting) {
        const [existingAgent] = await db
          .select()
          .from(agents)
          .where(eq(agents.id, existingMeeting.agentId));

        if (existingAgent && userId !== existingAgent.id) {
          const instructions = `You are an AI assistant helping the user revisit a recently completed meeting.\nSummary:\n${existingMeeting.summary || "No summary available."}\nAgent Persona: ${existingAgent.instructions}`;

          const channel = streamChat.channel("messaging", channelId);
          await channel.watch();

          const completion = await groq.chat.completions.create({
            messages: [
              { role: "system", content: instructions },
              { role: "user", content: text },
            ],
            model: "openai/gpt-oss-120b",
          });

          const gptResponse = completion.choices[0]?.message?.content;
          if (gptResponse) {
            const avatarUrl = generateAvatarUri({
              seed: existingAgent.name,
              variant: "botttsNeutral",
            });

            await streamChat.upsertUser({
              id: existingAgent.id,
              name: existingAgent.name,
              image: avatarUrl,
            });

            await channel.sendMessage({
              text: gptResponse,
              user: {
                id: existingAgent.id,
                name: existingAgent.name,
                image: avatarUrl,
              },
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}