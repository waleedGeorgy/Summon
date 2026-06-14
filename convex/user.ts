// convex/user.ts
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
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingUser) {
      if (existingUser.name !== args.name) {
        await ctx.db.patch(existingUser._id, { name: args.name });
      }
      return existingUser;
    }

    if (!existingUser) {
      const newUser = {
        userId: args.userId,
        name: args.name,
        email: args.email,
        subscription: "free",
        token: 5000,
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
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (user) return user;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userToDelete = await ctx.db
      .query("Users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (userToDelete) {
      await ctx.db.delete("Users", userToDelete._id);
    }
  },
});
