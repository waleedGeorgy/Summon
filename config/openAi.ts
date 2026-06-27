import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";

export const createOpenRouterModel = (modelName?: string) => {
  return new ChatOpenAI({
    model: modelName || "google/gemma-4-31b-it:free",
    temperature: 0.7,
    streaming: true,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_APP_URL,
        "X-Title": "Summon",
      },
    },
  });
};

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer":
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "Summon",
  },
});
