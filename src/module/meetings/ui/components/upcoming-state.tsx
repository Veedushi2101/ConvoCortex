import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props{
    meetingId: string;
    onCancelMeeting:() => void;
    isCancellingMeeting: boolean;
}

export const UpcomingState = ({meetingId, onCancelMeeting, isCancellingMeeting} : Props) =>{
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState image="/upcoming.svg" 
            title="Not Started yet" 
            description="Once a meeting get started, your summary will appear here"/>

            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button variant="secondary" className="w-full lg:w-auto"
                onClick={onCancelMeeting}
                disabled={isCancellingMeeting}
                >
                    <BanIcon />
                    Cancel Meeting
                </Button>
                <Button disabled={isCancellingMeeting} asChild className="w-full lg:w-auto">
                <Link href={`/call/${meetingId}`}>
                    <VideoIcon />
                    Start a Meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
}