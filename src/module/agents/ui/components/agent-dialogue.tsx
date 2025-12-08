import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface AgentDialogueProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AgentDialogue = ({open, onOpenChange}: AgentDialogueProps) => {
    return(
        <ResponsiveDialog title="New Agent" description="Create a new agent to get started" open={open} onOpenChange={onOpenChange}>
            <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}