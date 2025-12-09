"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useConfirmation } from "@/hooks/use-confirmation";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialogue } from "../components/update-agent-dialogue";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";

interface Props{
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) =>{
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [updateAgentDialogue, setUpdateAgentDialogue] = useState(false);

    const {data} = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

                router.push("/agents");
            },

            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );

    const [RemoveConfirmation, confirmRemove] = useConfirmation(
        " Do you want to delete the agent? ",
        `Your action will delete the ${data.meetingCount} meetings associated with the Agent`
    );

    const handleRemoveAgent = async() =>{
        const ok = await confirmRemove();

        if(!ok) return;

        await removeAgent.mutateAsync({id: agentId});
    }

    return(
        <>
        <RemoveConfirmation />

        <UpdateAgentDialogue 
        open={updateAgentDialogue}
        onOpenChange={setUpdateAgentDialogue}
        initialValues={data}
        />
        
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader 
            agentId={agentId}
            agentName={data.name} 
            onEdit={() => setUpdateAgentDialogue(true)}
            onRemove={handleRemoveAgent}
            />

            <div className="bg-white rounded-lg border-accent">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar seed={data.name} variant="botttsNeutral" className="size-10"/>
                        <h2 className="text-2xl font-semibold">{data.name}</h2>
                    </div>

                    <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                        <VideoIcon /> {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                    </Badge>

                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">
                            Instructions
                        </p>
                        <p className="text-neutral-800">
                            {data.instructions || "No instructions provided for this agent."} 
                        </p>
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export const AgentsIdViewLoading = () => {
    return (
        <LoadingState title=" Loading Agent " description="Please wait while we load your agent data." />
    )
}

export const AgentsIdViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="There was an issue loading the agents. Please try again later." />
    )
}