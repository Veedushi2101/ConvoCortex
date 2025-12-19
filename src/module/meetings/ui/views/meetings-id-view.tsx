"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirmation } from "@/hooks/use-confirmation";
import { UpdateMeetingDialogue } from "../components/update-meeting-dialogue";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({meetingId}:Props) =>{
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [updateMeeting, setUpdateMeeting] = useState(false);

    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId})
    );

    const [RemoveConfirmation, confirmRemove] = useConfirmation(
            " Do you want to delete this meeting? ",
            `Your action will delete your meeting`
        );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () =>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push("/meetings");
            },
        })
    );

    const handleRemoveMeeting = async() =>{
        const ok = await confirmRemove();

        if(!ok) return;

        await removeMeeting.mutateAsync({id:meetingId})
    }

    const isActive = data.status === "active"
    const isUpcoming = data.status === "upcoming"
    const isCancelled = data.status === "cancelled"
    const isCompleted = data.status === "completed"
    const isProcessing = data.status === "processing"

    return(
        <>
        <RemoveConfirmation />
        <UpdateMeetingDialogue 
        open = {updateMeeting}
        onOpenChange={setUpdateMeeting}
        initialValues={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdViewHeader 
            meetingId={meetingId}
            meetingName={data.name}
            onEdit = {() => setUpdateMeeting(true)}
            onRemove = {handleRemoveMeeting}
            />

            {isCancelled && (<CancelledState />)}
            {isActive && (<ActiveState meetingId={meetingId}/>)}
            {isUpcoming && (<UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCancellingMeeting={false}/> )}
            {isProcessing && (<ProcessingState />)}
            {isCompleted && <CompletedState data={data}/>}
        </div>
        </>
    )
}
 
export const MeetingsIdViewLoading = () => {
    return (
        <LoadingState title="Loading Meeting" description="Please wait while we load your meeting." />
    )
}

export const MeetingsIdViewError = () => {
    return (
        <ErrorState title="Error Loading Meeting" description="There was an issue loading the meetings. Please try again later." />
    )
}