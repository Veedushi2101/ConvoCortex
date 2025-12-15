import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRouter } from "next/navigation";
import { MeetingForm } from "./meetings-form";

interface MeetingDialogueProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const MeetingDialogue = ({open, onOpenChange}: MeetingDialogueProps) => {
    const router = useRouter();
    return(
        <ResponsiveDialog title="New Meeting" description="Create a new meet to get started" open={open} onOpenChange={onOpenChange}>
            <MeetingForm
            onSuccess={(id) =>  {
                onOpenChange(false);
                router.push(`/meetings/${id}`)
            }} 
            onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}