import { prisma } from "y/server/db";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import { z } from "zod";

export const historicalRouter = createTRPCRouter({
  getPriceHistory: publicProcedure.input(z.string()).query(({ input }) => {
    // get a price from an individual day in the past
    const priceHistory = prisma.priceHistory.findMany({
      where: { name: input },
      orderBy: { date: "desc" },
      take: 30,
    });

    return priceHistory;
  }),
});
