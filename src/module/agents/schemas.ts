import { id } from "date-fns/locale";
import {z} from "zod";

export const AgentCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions are required"),
});

export const AgentUpdateSchema = AgentCreateSchema.extend({
    id: z.string().min(1, {message: "Agent ID is required"}),
})