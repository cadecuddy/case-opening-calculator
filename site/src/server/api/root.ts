import { createTRPCRouter } from "y/server/api/trpc";
import { caseRouter } from "y/server/api/routers/cases";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cases: caseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
