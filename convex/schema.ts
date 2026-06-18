import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";
import { Doc } from "./_generated/dataModel";

const CustomNode = v.object({
  data: v.object({
    color: v.string(),
    id: v.string(),
    label: v.string(),
    type: v.string(),
    settings: v.optional(
      v.object({
        includeHistory: v.boolean(),
        instructions: v.string(),
        model: v.string(),
        name: v.string(),
        output: v.string(),
        schema: v.string(),
      }),
    ),
  }),
  dragging: v.optional(v.boolean()),
  id: v.string(),
  measured: v.object({
    height: v.number(),
    width: v.number(),
  }),
  position: v.object({
    x: v.number(),
    y: v.number(),
  }),
  selected: v.boolean(),
  type: v.string(),
});

export type CustomNode = Infer<typeof CustomNode>;
export { CustomNode };

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
    nodes: v.optional(v.array(CustomNode)),
    edges: v.optional(v.any()),
    isPublished: v.boolean(),
    createdBy: v.id("Users"),
  }),
});

export type User = Doc<"Users">;
export type Agent = Doc<"Agents">;
