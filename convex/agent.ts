import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNewAgent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    userId: v.id("Users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("Agents", {
      name: args.name,
      description: args.description,
      isPublished: false,
      createdBy: args.userId,
    });
    return result;
  },
});

export const fetchAllAgents = query({
  args: { createdBy: v.id("Users") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("Agents")
      .filter((q) => q.eq(q.field("createdBy"), args.createdBy))
      .order("desc")
      .collect();
    return results;
  },
});

export const getAgentById = query({
  args: { agentId: v.id("Agents") },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);

    if (agent) return agent;
  },
});

export const updateAgentDetails = mutation({
  args: {
    agentId: v.id("Agents"),
    nodes: v.any(),
    edges: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      nodes: args.nodes,
      edges: args.edges,
    });
  },
});

export const deleteAgent = mutation({
  args: { agentId: v.id("Agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete("Agents", args.agentId);
  },
});
