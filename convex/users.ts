import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, action, internalMutation, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const createUser = internalMutation({
  args: { name: v.string(), email: v.string(), tokenIdentifier: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
    });
  },
});