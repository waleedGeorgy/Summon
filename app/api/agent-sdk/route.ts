import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { createAgentFromWorkflow, WorkflowConfig } from "@/lib/agent";
import { auth } from "@clerk/nextjs/server";
import { aj } from "@/config/arcjet";
import { createOpenRouterModel } from "@/config/init-ai";

// In‑memory conversation cache (you could also move this to Convex for persistence)
const conversations = new Map<string, BaseMessage[]>();

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const decision = await aj.protect(req, { userId, requested: 1 });

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const {
      agentId,
      userId,
      input,
      conversationId: reqConvId,
    } = await req.json();

    // 1. Fetch the agent from Convex
    const agent = await fetchQuery(api.agent.getAgentById, { agentId });
    if (!agent || !agent.isPublished) {
      return NextResponse.json(
        { error: "Agent not found or not published" },
        { status: 404 },
      );
    }

    // 2. Get or create the conversation ID
    let conversationId = reqConvId;
    if (!conversationId) {
      // Create a new conversation in Convex and use its ID
      conversationId = await fetchMutation(
        api.conversation.ensureConversation,
        {
          agentId,
          userId,
        },
      );
    }

    // 3. Load conversation history (in‑memory – replace with Convex storage for production)
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    const chatHistory = conversations.get(conversationId)!;

    // 4. Build workflow config from the agent’s stored toolConfig
    const workflowConfig: WorkflowConfig = {
      agents: agent.config?.agents || [],
      tools: agent.config?.tools || [],
      primaryAgentName: agent.name || "AI Assistant",
      systemPrompt: agent.config?.systemPrompt || `You are ${agent.name}.`,
    };

    // 5. Model selection (you can also store the model on the agent)
    const model = createOpenRouterModel("google/gemma-4-31b-it:free");

    // 6. Create the agent and stream
    const langchainAgent = await createAgentFromWorkflow(model, workflowConfig);
    const messages: BaseMessage[] = [...chatHistory, new HumanMessage(input)];

    const eventStream = langchainAgent.streamEvents(
      { messages },
      { version: "v1" },
    );

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const event of eventStream) {
            if (event.event === "on_llm_stream") {
              const chunk = event.data?.chunk;
              const content =
                chunk?.message?.kwargs?.content ?? chunk?.message?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
                fullResponse += content;
              }
            }
            if (event.event === "on_tool_start") {
              controller.enqueue(
                encoder.encode(`\n🔧 Using ${event.name}...\n`),
              );
            }
            if (event.event === "on_tool_end") {
              controller.enqueue(encoder.encode(`\n✅ Done\n`));
            }
          }

          // Update history
          chatHistory.push(new HumanMessage(input));
          chatHistory.push(new AIMessage(fullResponse));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": conversationId,
      },
    });
  } catch (error) {
    console.error("SDK error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
