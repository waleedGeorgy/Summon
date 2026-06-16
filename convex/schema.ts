import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export default defineSchema({
  Users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
    tokens: v.number(),
  }).index("by_user_id", ["userId"]),

  Agents: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    config: v.optional(v.any()),
    nodes: v.optional(v.any()),
    edges: v.optional(v.any()),
    isPublished: v.boolean(),
    createdBy: v.id("Users"),
  }),
});

export type User = Doc<"Users">;
export type Agent = Doc<"Agents">;
