import { prisma } from "y/server/db";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";

export const listingRouter = createTRPCRouter({
  getCases: publicProcedure.query(async () => {
    const cases = await prisma.listing.findMany({ where: { type: "CASE" } });

    return cases;
  }),
  getCapsules: publicProcedure.query(async () => {
    const capsules = await prisma.listing.findMany({
      where: { type: "CAPSULE" },
    });

    return capsules;
  }),
  getPackages: publicProcedure.query(async () => {
    const packages = await prisma.listing.findMany({
      where: { type: "PACKAGE" },
    });

    return packages;
  }),
  getListings: publicProcedure.query(async () => {
    const listings = await prisma.listing.findMany();

    return listings;
  }),
});
