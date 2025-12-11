import { db } from "@/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { meetings } from "@/db/schema";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { AGENT_PAGE, AGENTS_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingsCreateSchema, meetingUpdateSchema } from "../schemas";


export const meetingsRouter = createTRPCRouter({

    update: protectedProcedure.input(meetingUpdateSchema).mutation(async ({ input, ctx }) => {
            const [updatedMeeting] = await db
            .update(meetings)
            .set(input)
            .where(and(
                eq(meetings.id, input.id),
                eq(meetings.userId, ctx.auth.user.id),
            ))
            .returning();
            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Meeting with id ${input.id} not found.`,
                });
            }
            return updatedMeeting;
        }),

    create: protectedProcedure.input(meetingsCreateSchema)
        .mutation(async({input, ctx}) =>{
            const {name, agentId} = input;
            const [createdMeeting] = await db.insert(meetings).values({
                ...input,
                userId: ctx.auth.user.id,
            })
            .returning();
            return createdMeeting;
        }),

    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
        .select({
            ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
        ));
        
        if (!existingMeeting) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Meeting with id ${input.id} not found.`,
            });
        }
        return existingMeeting;
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
            ...getTableColumns(meetings),
        }
        ).from(meetings)
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined
            )
        ).orderBy(desc(meetings.createdAt), desc(meetings.id)).limit(pagesize).offset((page - 1) * pagesize);

        const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined
            )
        );

        const totalPages = Math.ceil(total.count / pagesize);
        return {
            items: data,
            total: total.count,
            totalPages
        };
    }),

});