import { z } from "zod";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MeetingsOne } from "../../types";
import { meetingsCreateSchema } from "../../schemas";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { AgentDialogue } from "@/module/agents/ui/components/agent-dialogue";

interface MeetingFormProps{
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingsOne;
}

export const MeetingForm = ({onSuccess, onCancel, initialValues}: MeetingFormProps) =>{
    const trpc = useTRPC();
    // const router = useRouter();
    const queryClient = useQueryClient();

    const [openAgentDialogue, setOpenAgentDialogue] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");

    const agents = useQuery(trpc.agents.getMany.queryOptions({
        pagesize: 100,
        search: agentSearch
    }));

    const createMeeting = useMutation( trpc.meetings.create.mutationOptions({
        onSuccess: async(data) =>{
           await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            onSuccess?.(data.id);
        },
        onError: (error) =>{
            toast.error(error.message);
        },
    }) 
    ); 

    const updateMeeting = useMutation( trpc.meetings.update.mutationOptions({
        onSuccess: async() =>{
           await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            if(initialValues?.id){
                await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({id: initialValues.id}));
            }
            onSuccess?.();
        },
        onError: (error) =>{
            toast.error(error.message);
        },
    }) 
    ); 

    const form = useForm<z.infer<typeof meetingsCreateSchema>>({
        resolver: zodResolver(meetingsCreateSchema),
        defaultValues: {
            name: initialValues?.name ??"",
            agentId: initialValues?.agentId ??"",
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = async (data: z.infer<typeof meetingsCreateSchema>) =>{
        if(isEdit){
            updateMeeting.mutate({ ...data, id:initialValues.id})
        }
        else{
            createMeeting.mutate(data);
        }
    }

    return(
        <>
        <AgentDialogue open={openAgentDialogue} onOpenChange={setOpenAgentDialogue} />
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Create your new meeting here"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField name="agentId" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <FormControl>
                            <CommandSelect options={(agents.data?.items ?? [])
                                .map((agents) => ({
                                    id:agents.id,
                                    value: agents.id,
                                    children: (
                                        <div className="flex items-center gap-x-2">
                                            <GeneratedAvatar 
                                            seed={agents.name}
                                            variant="botttsNeutral"
                                            className="border size-6"
                                            />
                                            <span>{agents.name}</span>
                                        </div>
                                    )
                                }))
                                } 
                                onSelect={field.onChange}
                                onSearch={setAgentSearch}
                                value={field.value}
                                placeholder="Select your agent"
                                />
                        </FormControl>
                        <FormDescription>
                            Not Agent! Lets create a new Agent {"   "}
                            <button type="button" className="text-primary hover:underline"
                            onClick={() => setOpenAgentDialogue(true)}
                            >
                                Create a new Agent 
                            </button>
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
        
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                    <Button type="button" disabled={isPending} 
                    variant="destructive" onClick={ () => onCancel()}>
                        Cancel
                    </Button>
                    )}
                    <Button type="submit" disabled={isPending} className="ml-2">
                        {isEdit ? "Save Changes" : "Create Meeting"}
                    </Button>
                </div>
            </form>
        </Form>
        </>
    )
}