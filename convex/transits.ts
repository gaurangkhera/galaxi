// transits.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTransit = query({
  args: {
    transitId: v.id("transits"),
  },
  handler: async (ctx, args) => {
    const transit = await ctx.db.get(args.transitId);
    return transit;
  },
});

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
      transitQuery = transitQuery.filter((q) => q.gte(q.field("departureTime"), args.startTime as number));
    }
    if (args.endTime) {
      transitQuery = transitQuery.filter((q) => q.lte(q.field("departureTime"), args.endTime as number));
    }
    return await transitQuery.collect();
  },
});

function calculateETA(fromCoordinates: { x: number; y: number; z: number }, 
  toCoordinates: { x: number; y: number; z: number }) {
  const dx = toCoordinates.x - fromCoordinates.x;
  const dy = toCoordinates.y - fromCoordinates.y;
  const dz = toCoordinates.z - fromCoordinates.z;
  const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

  const wormholeOverhead = 0.1;
  const etaHours = wormholeOverhead;

  return Math.round(etaHours * 100) / 100;
}

export const getTransits = query({
  args: {
    transitIds: v.array(v.id("transits")),
  },
  handler: async (ctx, args) => {
    const transits = await Promise.all(
      args.transitIds.map((id) => ctx.db.get(id))
    );
    return transits.filter((transit): transit is NonNullable<typeof transit> => transit !== null);
  },
});

export const getTransitDetails = query({
  args: { transitId: v.id("transits") },
  handler: async (ctx, args) => {
    const transit = await ctx.db.get(args.transitId);
    if(!transit) throw new Error("Transit not found.");
    
    const fromPlanet = await ctx.db.get(transit.fromPlanetId);
    const toPlanet = await ctx.db.get(transit.toPlanetId);
    
    if (!fromPlanet || !toPlanet) throw new Error("Planet not found.");

    const eta = calculateETA(fromPlanet.coordinates, toPlanet.coordinates);

    return { 
      ...transit, 
      fromPlanet, 
      toPlanet,
      eta // Add ETA to the returned object
    };
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