import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNewUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("Users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      if (existingUser.name !== args.name) {
        await ctx.db.patch(existingUser._id, { name: args.name });
      }
    }

    if (!existingUser) {
      const newUser = {
        userId: args.userId,
        name: args.name,
        email: args.email,
        subscription: "free" as const,
      };
      await ctx.db.insert("Users", newUser);
    }
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("Users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (user) return user;
  },
});

export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userToDelete = await ctx.db
      .query("Users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!userToDelete) throw new Error("User not found");

    const workflowsToDelete = await ctx.db
      .query("Workflows")
      .withIndex("by_created_by", (q) => q.eq("createdBy", userToDelete._id))
      .collect();

    for (const workflow of workflowsToDelete) {
      await ctx.db.delete(workflow._id);
    }

    await ctx.db.delete(userToDelete._id);
  },
});

export const updateSubscription = mutation({
  args: {
    userId: v.string(),
    subscription: v.union(v.literal("free"), v.literal("unlimited")),
    subscriptionStatus: v.string(),
    currentPeriodEnd: v.optional(v.union(v.null(), v.number())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("Users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
    if (!user) return;

    await ctx.db.patch(user._id, {
      subscription: args.subscription,
      subscriptionStatus: args.subscriptionStatus,
      currentPeriodEnd: args.currentPeriodEnd,
    });
  },
});
