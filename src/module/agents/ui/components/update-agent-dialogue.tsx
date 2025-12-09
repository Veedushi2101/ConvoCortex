import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentOne } from "../../types";

interface UpdateAgentDialogueProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentOne;
}

export const UpdateAgentDialogue = ({open, onOpenChange, initialValues}: UpdateAgentDialogueProps) => {
    return(
        <ResponsiveDialog title="Edit the Agent" description="Edit the agent details" open={open} onOpenChange={onOpenChange}>
            <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}