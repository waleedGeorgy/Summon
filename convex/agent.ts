import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { CustomNode } from "./schema";

export const createNewAgent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    userId: v.id("Users"),
    nodes: v.optional(v.array(CustomNode)),
    edges: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    if (user.subscription === "free") {
      const activeAgents = await ctx.db
        .query("Agents")
        .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();

      if (activeAgents.length >= 2) {
        throw new Error("Free plan limited to 2 agents");
      }
    }

    const result = await ctx.db.insert("Agents", {
      name: args.name,
      description: args.description,
      isPublished: false,
      createdBy: args.userId,
      status: "active",
      nodes: args.nodes ?? [],
      edges: args.edges ?? [],
    });
    return result;
  },
});

export const fetchAllAgents = query({
  args: { createdBy: v.id("Users") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("Agents")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.createdBy))
      .order("desc")
      .collect();
    return results;
  },
});

export const fetchAllTemplates = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("Templates").collect();
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
    nodes: v.array(CustomNode),
    edges: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      nodes: args.nodes,
      edges: args.edges,
    });
  },
});

export const updateWorkflowNameAndDescription = mutation({
  args: {
    agentId: v.id("Agents"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      name: args.name,
      description: args.description ? args.description : "",
    });
  },
});

export const deleteAgent = mutation({
  args: { agentId: v.id("Agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete("Agents", args.agentId);
  },
});

export const updateAgentConfig = mutation({
  args: {
    agentId: v.id("Agents"),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) throw new Error("User not authenticated");

    await ctx.db.patch(args.agentId, {
      config: args.config,
    });
  },
});

export const togglePublishAgent = mutation({
  args: {
    agentId: v.id("Agents"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");

    await ctx.db.patch(args.agentId, {
      isPublished: args.isPublished,
    });

    return { success: true };
  },
});

export const updateAgentsStatus = mutation({
  args: {
    userId: v.id("Users"),
    newPlan: v.union(v.literal("free"), v.literal("unlimited")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      subscription: args.newPlan,
    });

    const agents = await ctx.db
      .query("Agents")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
      .order("desc")
      .collect();

    if (args.newPlan === "free") {
      for (let i = 0; i < agents.length; i++) {
        const newStatus = i < 2 ? "active" : "locked";
        await ctx.db.patch(agents[i]._id, { status: newStatus });
      }
    } else {
      for (const agent of agents) {
        if (agent.status === "locked") {
          await ctx.db.patch(agent._id, { status: "active" });
        }
      }
    }
  },
});
