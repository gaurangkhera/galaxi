import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
      email: v.string(),
      tokenIdentifier: v.string(),
    })
      .index("by_tokenIdentifier", ["tokenIdentifier"])
      .index("by_email", ["email"]),

    planets: defineTable({
      name: v.string(),
      coordinates: v.object({
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
    }).index("by_name", ["name"]),

    transits: defineTable({
      fromPlanetId: v.id("planets"),
      toPlanetId: v.id("planets"),
      departureTime: v.number(), // Unix timestamp
      arrivalTime: v.number(), // Unix timestamp
      status: v.string(), // e.g., "scheduled", "in-transit", "completed", "cancelled"
      type: v.string(), // e.g., "passenger", "cargo"
      capacity: v.number(),
      availableSeats: v.number(),
    })
      .index("by_departure", ["departureTime"])
      .index("by_fromPlanet", ["fromPlanetId"])
      .index("by_toPlanet", ["toPlanetId"])
      .index("by_status", ["status"]),

    bookings: defineTable({
      userId: v.id("users"),
      transitId: v.id("transits"),
      bookingType: v.string(), // e.g., "passenger", "cargo"
      quantity: v.number(), // Number of seats or cargo units
      status: v.string(), // e.g., "confirmed", "cancelled"
    })
      .index("by_user", ["userId"])
      .index("by_transit", ["transitId"]),
  },
  { schemaValidation: true }
);