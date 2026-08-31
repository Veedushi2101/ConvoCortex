import Image from "next/image";
import Link from "next/link";
import {
  CallControls,
  PaginatedGridLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      {/* Top Header */}
      <div className="bg-[#101213] rounded-full p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit"
          >
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          </Link>
          <h4 className="text-base font-medium">{meetingName}</h4>
        </div>
        <div className="text-sm text-neutral-400">
          Participants: {participants.length}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 my-4 flex items-center justify-center overflow-hidden">
        <PaginatedGridLayout />
      </div>

      {/* Call Controls */}
      <div className="bg-[#101213] rounded-full p-4 flex items-center justify-center">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};