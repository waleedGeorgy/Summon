import { v } from "convex/values";
import { query } from "./_generated/server";

export const getConversationById = query({
  args: {
    agentId: v.id("Agents"),
    userId: v.id("Users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("Conversations")
      .filter((q) =>
        q.add(
          q.eq(q.field("agentId"), args.agentId),
          q.eq(q.field("userId"), args.userId),
        ),
      )
      .collect();

    return result[0];
  },
});
