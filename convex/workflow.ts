import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { CustomNode } from "./schema";

export const createNewWorkflow = mutation({
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
      const activeWorkflows = await ctx.db
        .query("Workflows")
        .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();

      if (activeWorkflows.length >= 2)
        throw new Error("Free plan limited to 2 agents");
    }

    const insertedWorkflowId = await ctx.db.insert("Workflows", {
      name: args.name,
      description: args.description,
      isPublished: false,
      createdBy: args.userId,
      status: "active",
      nodes: args.nodes ?? [],
      edges: args.edges ?? [],
    });
    return insertedWorkflowId;
  },
});

export const fetchAllWorkflows = query({
  args: { createdBy: v.id("Users") },
  handler: async (ctx, args) => {
    const workflows = await ctx.db
      .query("Workflows")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.createdBy))
      .order("desc")
      .collect();
    return workflows;
  },
});

export const fetchAllTemplates = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query("Templates").collect();
    return templates;
  },
});

export const getWorkflowById = query({
  args: { workflowId: v.id("Workflows") },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (workflow) return workflow;
  },
});

export const updateWorkflowNodesAndEdges = mutation({
  args: {
    workflowId: v.id("Workflows"),
    nodes: v.array(CustomNode),
    edges: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workflowId, {
      nodes: args.nodes,
      edges: args.edges,
    });
  },
});

export const updateWorkflowNameAndDescription = mutation({
  args: {
    workflowId: v.id("Workflows"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workflowId, {
      name: args.name,
      description: args.description ? args.description : "",
    });
  },
});

export const deleteWorkflow = mutation({
  args: { workflowId: v.id("Workflows") },
  handler: async (ctx, args) => {
    await ctx.db.delete("Workflows", args.workflowId);
  },
});

export const updateWorkflowConfig = mutation({
  args: {
    workflowId: v.id("Workflows"),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity();
    if (!authUser) throw new Error("User not authenticated");

    await ctx.db.patch(args.workflowId, {
      agentConfig: args.config,
    });
  },
});

export const togglePublishStatus = mutation({
  args: {
    workflowId: v.id("Workflows"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await ctx.db.patch(args.workflowId, {
      isPublished: args.isPublished,
    });

    return { success: true };
  },
});

export const updateWorkflowStatus = mutation({
  args: {
    userId: v.id("Users"),
    newPlan: v.union(v.literal("free"), v.literal("unlimited")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      subscription: args.newPlan,
    });

    const workflows = await ctx.db
      .query("Workflows")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.userId))
      .order("desc")
      .collect();

    if (args.newPlan === "free") {
      for (let i = 0; i < workflows.length; i++) {
        const newStatus = i < 2 ? "active" : "locked";
        await ctx.db.patch(workflows[i]._id, { status: newStatus });
      }
    } else {
      for (const workflow of workflows) {
        if (workflow.status === "locked") {
          await ctx.db.patch(workflow._id, { status: "active" });
        }
      }
    }
  },
});
