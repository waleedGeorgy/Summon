import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

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

export const createToolFromConfig = (config: ToolConfig) => {
  // Build Zod schema from the parameters object
  const paramSchema = z.object(
    Object.fromEntries(
      Object.entries(config.parameters).map(([key, type]) => {
        if (type === "number") return [key, z.number()];
        return [key, z.string()];
      }),
    ),
  );

  return new DynamicStructuredTool({
    name: config.name.replace(/\s+/g, "_").toLowerCase(), // valid identifier
    description: config.description,
    schema: paramSchema,
    func: async (params: Record<string, unknown>) => {
      try {
        let url = config.url;

        // Replace URL parameters
        for (const key in params) {
          url = url.replace(
            `{${key}}`,
            encodeURIComponent(String(params[key])),
          );
        }

        // Append API key if needed
        if (config.includeApiKey && config.apiKey) {
          url += url.includes("?")
            ? `&key=${config.apiKey}`
            : `?key=${config.apiKey}`;
        }

        const response = await fetch(url, {
          method: config.method || "GET",
        });
        const data = await response.json();

        // Return a string – LangChain tools must return string
        return JSON.stringify(data, null, 2);
      } catch (error) {
        console.error("Error executing tool %s:", config.name, error);
        return JSON.stringify({ error: "Tool execution failed" });
      }
    },
  });
};
