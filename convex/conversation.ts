import { v4 as uuidv4 } from "uuid";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getConversationById = query({
  args: {
    agentId: v.id("Workflows"),
    userId: v.id("Users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("Conversations")
      .withIndex("by_agent_and_user", (q) =>
        q.eq("agentId", args.agentId).eq("userId", args.userId),
      )
      .first();

    return result;
  },
});

export const ensureConversation = mutation({
  args: {
    agentId: v.id("Workflows"),
    userId: v.id("Users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("Conversations")
      .withIndex("by_agent_and_user", (q) =>
        q.eq("agentId", args.agentId).eq("userId", args.userId),
      )
      .first();
    if (existing) {
      return existing.conversationId;
    }
    const newId = uuidv4();
    await ctx.db.insert("Conversations", {
      conversationId: newId,
      agentId: args.agentId,
      userId: args.userId,
    });
    return newId;
  },
});
