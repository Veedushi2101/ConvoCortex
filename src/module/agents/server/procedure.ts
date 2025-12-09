import { db } from "@/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { agents } from "@/db/schema";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { AGENT_PAGE, AGENTS_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { AgentCreateSchema } from "../schemas";

export const agentRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingAgent] = await db
        .select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        })
        .from(agents)
        .where(and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id),
        ));
        
        if (!existingAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Agent with id ${input.id} not found.`,
            });
        }
        return existingAgent;
    }), 
    getMany: protectedProcedure
    .input(z.object({
        page: z.number().default(AGENT_PAGE),
        pagesize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(AGENTS_PAGE_SIZE),
        search: z.string().nullish(),
    }))
    .query(async ({ctx, input}) => {
        const {search, page, pagesize} = input;
        const data = await db
        .select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        }
        ).from(agents)
        .where(
            and(
                eq(agents.userId, ctx.auth.user.id),
                search ? ilike(agents.name, `%${search}%`) : undefined
            )
        ).orderBy(desc(agents.createdAt), desc(agents.id)).limit(pagesize).offset((page - 1) * pagesize);

        const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
            and(
                eq(agents.userId, ctx.auth.user.id),
                search ? ilike(agents.name, `%${search}%`) : undefined
            )
        );

        const totalPages = Math.ceil(total.count / pagesize);
        return {
            items: data,
            total: total.count,
            totalPages
        };
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