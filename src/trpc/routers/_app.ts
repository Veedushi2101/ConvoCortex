import {agentRouter} from '@/module/agents/server/procedure';
import { meetingsRouter } from '@/module/meetings/server/procedure';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  meetings: meetingsRouter,
  
});
// export type definition of API
export type AppRouter = typeof appRouter;