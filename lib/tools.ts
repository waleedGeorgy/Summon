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

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

function isDisallowedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "::1" ||
    h.startsWith("127.") ||
    h.startsWith("10.") ||
    h.startsWith("192.168.") ||
    h.startsWith("169.254.") ||
    h.endsWith(".local")
  );
}

function validateToolBaseUrl(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Tool URL must use http or https.");
  }
  if (isDisallowedHostname(parsed.hostname)) {
    throw new Error("Tool URL hostname is not allowed.");
  }
  return parsed;
}

export const createToolFromConfig = (config: ToolConfig) => {
  // Validate URL up-front to avoid creating unsafe tools
  validateToolBaseUrl(config.url);

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
    name: config.name.replace(/\s+/g, "_").toLowerCase(),
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

        const requestUrl = validateToolBaseUrl(url);

        // Append API key if needed
        if (config.includeApiKey && config.apiKey) {
          requestUrl.searchParams.append("key", config.apiKey);
        }

        const method = (config.method || "GET").toUpperCase();
        const safeMethod = ALLOWED_METHODS.has(method) ? method : "GET";

        const response = await fetch(requestUrl.toString(), {
          method: safeMethod,
        });
        const data = await response.json();

        return JSON.stringify(data, null, 2);
      } catch (error) {
        console.error("Error executing tool %s:", config.name, error);
        return JSON.stringify({ error: "Tool execution failed" });
      }
    },
  });
};
