// src/inngest/function.ts
import { inngest } from "./client";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings-processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const { meetingId, transcriptUrl } = event.data;

    // 1. Fetch & Parse Transcript
    const transcriptText = await step.run("fetch-transcript", async () => {
      if (!transcriptUrl || transcriptUrl.trim() === "") {
        return "No spoken dialog was detected in this brief session.";
      }

      try {
        const res = await fetch(transcriptUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawText = await res.text();

        const parsedLines = rawText
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            try {
              const data = JSON.parse(line);
              const speaker = data.speaker_id || data.user_id || "Speaker";
              const text = data.text || data.transcript || "";
              return text ? `${speaker}: ${text}` : null;
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .join("\n");

        return parsedLines.trim().length > 0
          ? parsedLines
          : "No spoken audio was transcribed for this session.";
      } catch (err: any) {
        return "No spoken audio was transcribed for this session.";
      }
    });

    // 2. Generate Evaluation Summary with Groq
    const summary = await step.run("generate-summary-with-groq", async () => {
      const isShortCall =
        !transcriptText ||
        transcriptText.includes("No spoken") ||
        transcriptText.length < 20;

      const userPrompt = isShortCall
        ? "The interview session concluded very quickly with minimal or no audio detected. Provide a brief note stating the session was too short for a full technical evaluation, along with general recommendations for conducting a complete interview."
        : `Here is the interview transcript:\n\n${transcriptText}`;

      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI interview evaluator. Generate a clean, well-structured summary. If sufficient dialog exists, breakdown the candidate's technical proficiency, strengths, and areas for improvement using concise bullet points.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      return completion.choices[0]?.message?.content || "No summary generated.";
    });

    // 3. Save Summary to Database
    await step.run("save-to-db", async () => {
      await db
        .update(meetings)
        .set({
          summary,
          status: "completed",
        })
        .where(eq(meetings.id, meetingId));
    });

    return { success: true, meetingId };
  }
);