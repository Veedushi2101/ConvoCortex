"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { LoaderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateTokenMutation } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  // Keep a stable ref to avoid infinite re-renders
  const tokenMutationRef = useRef(generateTokenMutation);
  tokenMutationRef.current = generateTokenMutation;

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Use getOrCreateInstance to prevent duplicate client warnings and render loops
    const _client = StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: () => tokenMutationRef.current(),
    });

    const _call = _client.call("default", meetingId);

    _call
      .getOrCreate({
        data: {
          custom: {
            meetingId,
          },
        },
      })
      .then(() => {
        if (!isMounted) return;
        _call.camera.disable();
        _call.microphone.disable();
        setClient(_client);
        setCall(_call);
      })
      .catch((err) => {
        console.error("Failed to initialize call:", err);
      });

    return () => {
      isMounted = false;
      if (_call && _call.state.callingState !== CallingState.LEFT) {
        _call.leave().catch(() => {});
      }
      setCall(null);
      setClient(null);
    };
  }, [userId, userName, userImage, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};