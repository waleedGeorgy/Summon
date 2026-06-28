import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { createAgentFromWorkflow, WorkflowConfig } from "@/lib/agent";
import { createOpenRouterModel } from "@/config/openAi";
import { auth } from "@clerk/nextjs/server";
import { aj } from "@/config/arcjet";

export interface AgentConfig {
  id: string;
  name: string;
  instructions: string;
  model?: string;
  includeHistory?: boolean;
  tools?: string[];
}

export interface ToolConfig {
  id?: string;
  name: string;
  description: string;
  url: string;
  method?: string;
  parameters: Record<string, string>;
  apiKey?: string;
  includeApiKey?: boolean;
  assignedAgent?: string;
}

interface RequestBody {
  input: string;
  tools?: ToolConfig[];
  agents?: AgentConfig[];
  convId?: string;
  agentName?: string;
  systemPrompt?: string;
  primaryAgentName?: string;
}

const conversations = new Map<string, BaseMessage[]>();

const MODELS = [
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-120b:free",
  "deepseek/deepseek-chat",
] as const;

const MODEL_SET = new Set<string>(MODELS);

function resolveModel(model?: string) {
  if (!model) return MODELS[0];

  if (model.includes("/")) {
    const lower = model.toLowerCase();
    return MODEL_SET.has(lower) ? lower : MODELS[0];
  }

  const map: Record<string, string> = {
    gemma: MODELS[0],
    gptoss: MODELS[1],
    deepseek: MODELS[2],
  };

  return map[model.toLowerCase()] || MODELS[0];
}

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
    const body: RequestBody = await req.json();
    const {
      input,
      tools = [],
      agents = [],
      convId,
      agentName,
      systemPrompt,
      primaryAgentName,
    } = body;

    if (!input) return NextResponse.json({ error: "Input is required" }, { status: 400 });

    // Conversation handling
    const conversationId = typeof convId === "string" ? convId : uuidv4();
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    const chatHistory = conversations.get(conversationId)!;

    const workflowConfig: WorkflowConfig = {
      agents,
      tools,
      primaryAgentName: primaryAgentName || agentName || "AI Assistant",
      systemPrompt:
        systemPrompt ||
        `You are ${agentName || "an AI assistant"}. Help the user with their queries.`,
    };

    const primaryAgent =
      agents.find((a) => a.name === primaryAgentName) || agents[0];
    const modelName = resolveModel(primaryAgent?.model);
    const model = createOpenRouterModel(modelName);

    const agent = await createAgentFromWorkflow(model, workflowConfig);

    const messages: BaseMessage[] = [...chatHistory, new HumanMessage(input)];

    const eventStream = agent.streamEvents({ messages }, { version: "v1" });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const event of eventStream) {
            if (event.event === "on_llm_stream") {
              const chunk = event.data?.chunk;

              const content: string | undefined =
                chunk?.message?.kwargs?.content ?? chunk?.message?.content;

              if (content) {
                controller.enqueue(encoder.encode(content));
                fullResponse += content;
              }
            }

            // Optional tool notifications
            if (event.event === "on_tool_start") {
              controller.enqueue(
                encoder.encode(`\n🔧 Using ${event.name}...\n`),
              );
            }
            if (event.event === "on_tool_end") {
              controller.enqueue(encoder.encode(`\n✅ Done\n`));
            }
          }

          // Update conversation history
          chatHistory.push(new HumanMessage(input));
          chatHistory.push(new AIMessage(fullResponse));

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
          return NextResponse.json(
            {
              error: "Streaming error",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
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
    console.error("Agent chat error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const conversationId = uuidv4();
  return NextResponse.json({ conversationId });
}
