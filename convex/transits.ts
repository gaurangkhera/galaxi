import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// Constants for ETA calculation
const LIGHT_SPEED = 299792458; // meters per second
const SPACECRAFT_SPEED_FRACTION = 0.1; // 10% of light speed
const SPACECRAFT_SPEED = LIGHT_SPEED * SPACECRAFT_SPEED_FRACTION;
const AU_TO_KM = 149597870.7;

export function calculateRealisticETA(fromCoordinates: { x: number; y: number; z: number }, 
  toCoordinates: { x: number; y: number; z: number }): number {
const dx = (toCoordinates.x - fromCoordinates.x) * AU_TO_KM;
const dy = (toCoordinates.y - fromCoordinates.y) * AU_TO_KM;
const dz = (toCoordinates.z - fromCoordinates.z) * AU_TO_KM;
const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

const travelTimeSeconds = distance / SPACECRAFT_SPEED;
const wormholeOverheadSeconds = 3600; // 1 hour overhead for wormhole travel

// Convert to milliseconds and ensure a minimum travel time of 2 hours and maximum of 48 hours
const totalTravelTimeMs = Math.max(7200000, Math.min((travelTimeSeconds + wormholeOverheadSeconds) * 1000, 172800000));

return Math.round(totalTravelTimeMs);
}

export const createAutomatedTransit = mutation({
  args: {
    fromPlanetId: v.id("planets"),
    toPlanetId: v.id("planets"),
    departureTime: v.number(),
    type: v.string(),
    capacity: v.number(),
  },
  handler: async (ctx, args) => {
    const fromPlanet = await ctx.db.get(args.fromPlanetId);
    const toPlanet = await ctx.db.get(args.toPlanetId);

    if (!fromPlanet || !toPlanet) {
      throw new Error("Invalid planet ID(s)");
    }

    const eta = calculateRealisticETA(fromPlanet.coordinates, toPlanet.coordinates);
    const arrivalTime = args.departureTime + eta;

    const transitId = await ctx.db.insert("transits", {
      fromPlanetId: args.fromPlanetId,
      toPlanetId: args.toPlanetId,
      departureTime: args.departureTime,
      arrivalTime: arrivalTime,
      status: "scheduled",
      type: args.type,
      capacity: args.capacity,
      availableSeats: args.capacity,
    });

    return transitId;
  },
});

export const generateDailyTransits = mutation({
  handler: async (ctx) => {
    const planets = await ctx.db.query("planets").collect();
    const planetCount = planets.length;

    if (planetCount < 2) {
      console.log("Not enough planets to generate transits");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowMidnight = new Date(today);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    for (let i = 0; i < planetCount; i++) {
      const fromPlanet = planets[i];
      const toPlanetIndex = (i + 1) % planetCount; // Ensures we don't transit to the same planet
      const toPlanet = planets[toPlanetIndex];

      // Outbound transit
      const outboundDepartureTime = today.getTime() + Math.random() * (tomorrowMidnight.getTime() - today.getTime());
      await ctx.db.insert("transits", {
        fromPlanetId: fromPlanet._id,
        toPlanetId: toPlanet._id,
        departureTime: outboundDepartureTime,
        arrivalTime: outboundDepartureTime + calculateRealisticETA(fromPlanet.coordinates, toPlanet.coordinates),
        status: "scheduled",
        type: Math.random() > 0.5 ? "passenger" : "cargo",
        capacity: Math.floor(Math.random() * 200) + 50, // Random capacity between 50 and 250
        availableSeats: Math.floor(Math.random() * 200) + 50,
      });

      // Return transit
      const returnDepartureTime = outboundDepartureTime + calculateRealisticETA(fromPlanet.coordinates, toPlanet.coordinates) + 3600000; // 1 hour layover
      if (returnDepartureTime < tomorrowMidnight.getTime()) {
        await ctx.db.insert("transits", {
          fromPlanetId: toPlanet._id,
          toPlanetId: fromPlanet._id,
          departureTime: returnDepartureTime,
          arrivalTime: returnDepartureTime + calculateRealisticETA(toPlanet.coordinates, fromPlanet.coordinates),
          status: "scheduled",
          type: Math.random() > 0.5 ? "passenger" : "cargo",
          capacity: Math.floor(Math.random() * 200) + 50,
          availableSeats: Math.floor(Math.random() * 200) + 50,
        });
      }
    }
  },
});

export const listAllPlanets = query({
  handler: async (ctx) => {
    return await ctx.db.query("planets").collect();
  },
});

export const listAllTransits = query({
  handler: async (ctx) => {
    return await ctx.db.query("transits").collect();
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

export const getTransitDetails = query({
  args: { transitId: v.id("transits") },
  handler: async (ctx, args) => {
    const transit = await ctx.db.get(args.transitId);
    if(!transit) throw new Error("Transit not found.");
    
    const fromPlanet = await ctx.db.get(transit.fromPlanetId);
    const toPlanet = await ctx.db.get(transit.toPlanetId);
    
    if (!fromPlanet || !toPlanet) throw new Error("Planet not found.");

    const eta = calculateRealisticETA(fromPlanet.coordinates, toPlanet.coordinates);

    return { 
      ...transit, 
      fromPlanet, 
      toPlanet,
      eta // Add ETA to the returned object
    };
  },
});

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

// Placeholder data generation
export const generatePlaceholderData = mutation({
  handler: async (ctx) => {
    // Generate placeholder planets
    const planetNames = ["MinetLand", "BetaLand", "MakeLand", "Kepler 186f"];
    const planetIds = [];

    for (const name of planetNames) {
      const planetId = await ctx.db.insert("planets", {
        name,
        coordinates: {
          x: Math.random() * 10 - 5, // Random value between -5 and 5
          y: Math.random() * 10 - 5,
          z: Math.random() * 10 - 5,
        },
      });
      planetIds.push(planetId);
    }

    // Generate placeholder transits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowMidnight = new Date(today);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    for (let i = 0; i < planetIds.length; i++) {
      const fromPlanetId = planetIds[i];
      const toPlanetId = planetIds[(i + 1) % planetIds.length];

      const fromPlanet = await ctx.db.get(fromPlanetId);
      const toPlanet = await ctx.db.get(toPlanetId);

      if (fromPlanet && toPlanet) {
        const departureTime = today.getTime() + Math.random() * (tomorrowMidnight.getTime() - today.getTime());
        const eta = calculateRealisticETA(fromPlanet.coordinates, toPlanet.coordinates);

        await ctx.db.insert("transits", {
          fromPlanetId,
          toPlanetId,
          departureTime,
          arrivalTime: departureTime + eta,
          status: "scheduled",
          type: Math.random() > 0.5 ? "passenger" : "cargo",
          capacity: Math.floor(Math.random() * 200) + 50,
          availableSeats: Math.floor(Math.random() * 200) + 50,
        });
      }
    }

    return "Placeholder data generated successfully";
  },
});