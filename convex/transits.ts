import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createTransit = mutation({
  args: {
    fromPlanetId: v.id("planets"),
    toPlanetId: v.id("planets"),
    departureTime: v.number(),
    arrivalTime: v.number(),
    type: v.string(),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    const transitId = await ctx.db.insert("transits", {
      ...args,
      status: "scheduled",
      availableSeats: args.capacity,
    });
    return transitId;
  },
});

export const listTransits = query({
  args: {
    fromPlanetId: v.optional(v.id("planets")),
    toPlanetId: v.optional(v.id("planets")),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let transitQuery = ctx.db.query("transits");

    if (args.fromPlanetId) {
      transitQuery = transitQuery.filter((q) => q.eq(q.field("fromPlanetId"), args.fromPlanetId));
    }
    if (args.toPlanetId) {
      transitQuery = transitQuery.filter((q) => q.eq(q.field("toPlanetId"), args.toPlanetId));
    }
    if (args.startTime) {
        //@ts-ignore
      transitQuery = transitQuery.filter((q) => q.gte(q.field("departureTime"), args.startTime));
    }
    if (args.endTime) {
        //@ts-ignore
      transitQuery = transitQuery.filter((q) => q.lte(q.field("departureTime"), args.endTime));
    }

    return await transitQuery.collect();
  },
});

export const getTransitDetails = query({
  args: { transitId: v.id("transits") },
  handler: async (ctx, args) => {
    const transit = await ctx.db.get(args.transitId);

    if(!transit) throw new ConvexError("Transit not found.");

    const fromPlanet = await ctx.db.get(transit.fromPlanetId);
    const toPlanet = await ctx.db.get(transit.toPlanetId);
    return { ...transit, fromPlanet, toPlanet };
  },
});

export const updateTransitStatus = mutation({
  args: {
    transitId: v.id("transits"),
    newStatus: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.transitId, { status: args.newStatus });
  },
});