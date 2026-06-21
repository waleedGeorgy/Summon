import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { createToolFromConfig } from "./tools";

interface AgentConfig {
  id: string;
  name: string;
  instructions: string;
  model?: string;
  includeHistory?: boolean;
  tools?: string[];
}

interface ToolConfig {
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

export interface WorkflowConfig {
  agents: AgentConfig[];
  tools: ToolConfig[];
  primaryAgentName: string;
  systemPrompt: string;
}

export const createAgentFromWorkflow = async (
  model: ChatOpenAI,
  workflowConfig: WorkflowConfig,
) => {
  const {
    agents,
    tools: toolsConfig,
    primaryAgentName,
    systemPrompt,
  } = workflowConfig;

  // Create LangChain tools
  const langchainTools = toolsConfig.map((cfg) => createToolFromConfig(cfg));

  // Build system prompt
  let systemMessage =
    systemPrompt || `You are ${primaryAgentName}, an AI assistant.`;

  if (agents.length > 0) {
    systemMessage += "\n\nYou have access to the following capabilities:\n";
    agents.forEach((agent) => {
      const agentTools = toolsConfig.filter(
        (t) => t.assignedAgent === agent.id,
      );
      systemMessage += `- ${agent.name}: ${agent.instructions}\n`;
      if (agentTools.length > 0) {
        systemMessage += `  Tools: ${agentTools.map((t) => t.name).join(", ")}\n`;
      }
    });
  }

  // Create the agent using LangChain v1.5+ createAgent
  const agent = createAgent({
    model,
    tools: langchainTools,
    systemPrompt: systemMessage,
  });

  return agent; // has streamEvents() method
};
