import { id } from "date-fns/locale";
import {z} from "zod";

export const meetingsCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    agentId: z.string().min(1, "Agent is required"),
});

export const meetingUpdateSchema = meetingsCreateSchema.extend({
    id: z.string().min(1, {message: "Agent ID is required"}),
})