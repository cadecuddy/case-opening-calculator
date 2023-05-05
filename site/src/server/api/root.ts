import { createTRPCRouter } from "y/server/api/trpc";
import { listingRouter } from "y/server/api/routers/listings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  listings: listingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
