import { db } from "@/db";
import { z } from "zod";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { AgentCreateSchema } from "../schemas";

export const agentRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));
        return existingAgent;
    }),
    getMany: protectedProcedure.query(async ({  }) => {
        const data = await db.select().from(agents);
        return data;
    }),

    create: protectedProcedure.input(AgentCreateSchema)
    .mutation(async({input, ctx}) =>{
        const {name, instruction} = input;
        const [createdAgent] = await db.insert(agents).values({
            ...input,
            instructions: instruction,
            userId: ctx.auth.user.id,
        })
        .returning();
        return createdAgent;
    })
});