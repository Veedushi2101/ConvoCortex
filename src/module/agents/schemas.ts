import {z} from "zod";

export const AgentCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instruction: z.string().min(1, "Instructions are required"),
});