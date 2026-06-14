import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export default defineSchema({
  Users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
    token: v.number(),
  }).index("by_user_id", ["userId"]),
});

export type UserType = Doc<"Users">;
