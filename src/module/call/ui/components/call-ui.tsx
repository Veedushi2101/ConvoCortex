import { CallingState, StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    try {
      await call.join();
      setShow("call");
    } catch (error) {
      console.error("Failed to join call:", error);
    }
  };

  const handleLeave = async () => {
    if (call && call.state.callingState !== CallingState.LEFT) {
      try {
        await call.leave();
      } catch (error) {
        console.warn("Call already left or disconnected:", error);
      }
    }
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
};