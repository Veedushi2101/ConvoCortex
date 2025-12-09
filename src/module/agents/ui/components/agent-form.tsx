import { z } from "zod";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { AgentOne } from "../../types";
import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AgentCreateSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AgentFormProps{
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentOne;
}

export const AgentForm = ({onSuccess, onCancel, initialValues}: AgentFormProps) =>{
    const trpc = useTRPC();
    // const router = useRouter();
    const queryClient = useQueryClient();

    const createAgent = useMutation( trpc.agents.create.mutationOptions({
        onSuccess: async() =>{
           await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            onSuccess?.();
        },
        onError: (error) =>{
            toast.error(error.message);
        },
    }) 
    ); 

    const updateAgent = useMutation( trpc.agents.update.mutationOptions({
        onSuccess: async() =>{
           await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            if(initialValues?.id){
                await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({id: initialValues.id}));
            }
            onSuccess?.();
        },
        onError: (error) =>{
            toast.error(error.message);
        },
    }) 
    ); 

    const form = useForm<z.infer<typeof AgentCreateSchema>>({
        resolver: zodResolver(AgentCreateSchema),
        defaultValues: {
            name: initialValues?.name ??"",
            instructions: initialValues?.instructions ??"",
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = async (data: z.infer<typeof AgentCreateSchema>) =>{
        if(isEdit){
            updateAgent.mutate({ ...data, id:initialValues.id})
        }
        else{
            createAgent.mutate(data);
        }
    }

    return(
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar seed={form.watch("name")} variant="botttsNeutral" className="border size-16"/>
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Enter agent name: ChatBot"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
        
                <FormField name="instructions" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instruction</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Enter agent instruction"/>
                        </FormControl>
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
                        {isEdit ? "Save Changes" : "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}