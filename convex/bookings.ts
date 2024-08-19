import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

interface Booking {
  _id: Id<"bookings">;
  userId: Id<"users">;
  transitId: Id<"transits">;
  bookingType: "passenger" | "cargo";
  quantity: number;
  status: "confirmed" | "cancelled";
}

export const createBooking = mutation({
  args: {
    userId: v.id("users"),
    transitId: v.id("transits"),
    bookingType: v.union(v.literal("passenger"), v.literal("cargo")),
    quantity: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"bookings">> => {
    const transit = await ctx.db.get(args.transitId);
    if (!transit) throw new Error("Transit not found");

    if (transit.availableSeats < args.quantity) {
      throw new Error("Not enough available seats/space");
    }

    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "confirmed",
    });

    await ctx.db.patch(args.transitId, {
      availableSeats: transit.availableSeats - args.quantity,
    });

    return bookingId;
  },
});

export const getBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args): Promise<Booking | null> => {
    return await ctx.db.get(args.bookingId) as Booking;
  },
})

export const listUserBookings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<Booking[]> => {
    //@ts-ignore
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const cancelBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args): Promise<void> => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.status === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    await ctx.db.patch(args.bookingId, { status: "cancelled" });

    const transit = await ctx.db.get(booking.transitId);
    if (!transit) throw new Error("Associated transit not found");

    await ctx.db.patch(booking.transitId, {
      availableSeats: transit.availableSeats + booking.quantity,
    });
  },
});