import {agentRouter} from '@/module/agents/server/procedure';
import { createTRPCRouter } from '../init';
import { agents } from '@/db/schema';

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  
});
// export type definition of API
export type AppRouter = typeof appRouter;