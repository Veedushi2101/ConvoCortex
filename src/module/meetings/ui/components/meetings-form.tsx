import { z } from "zod";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MeetingsOne } from "../../types";
import { meetingsCreateSchema } from "../../schemas";

interface MeetingFormProps{
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingsOne;
}

export const MeetingForm = ({onSuccess, onCancel, initialValues}: MeetingFormProps) =>{
    const trpc = useTRPC();
    // const router = useRouter();
    const queryClient = useQueryClient();

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
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Enter agent name: ChatBot"/>
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