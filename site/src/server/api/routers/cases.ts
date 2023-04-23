import { prisma } from "y/server/db";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";

export const caseRouter = createTRPCRouter({
  getCases: publicProcedure.query(async () => {
    const cases = await prisma.caseListing.findMany();

    return cases;
  }),
});
