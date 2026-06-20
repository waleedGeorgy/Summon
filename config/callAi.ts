"use server";
import { APIConnectionError, APIError } from "openai";
import { openai } from "./openAi";

export async function tryModel(model: string) {
  try {
    const response = await openai.responses.create({
      model,
      input: "You are a senior software developer. What is Typescript?",
    });

    console.log(response.output_text);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        throw error;
      }
    }
    throw error;
  }
}

export async function callAiAction() {
  const models = [
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-120b:free",
    "deepseek/deepseek-chat",
  ];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const result = await tryModel(model);
      return { success: true, data: result, modelUsed: model };
    } catch (error) {
      if (error instanceof APIError) {
        console.log(`Model ${model} failed:`, error.status, error.message);

        if (error.status === 429) {
          console.log("Rate limited, waiting 5 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        if (error.status === 404) {
          console.log(`${model} not found, trying next...`);
          continue;
        }
      } else if (error instanceof APIConnectionError) {
        console.log(`Connection error for ${model}:`, error.message);
        continue;
      } else {
        console.log(`Unknown error for ${model}:`, error);
        continue;
      }
    }
  }

  return {
    success: false,
    error: "All models failed. Please try again later.",
  };
}

/* 'use server'
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.mistral.ai/v1",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function callMistral() {
  try {
    const response = await client.chat.completions.create({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "You are a helpful and concise software engineering mentor.",
        },
        {
          role: "user",
          content:
            "Explain the difference between an interface and a type in TypeScript",
        },
      ],
    });

    return { success: true, data: response.choices[0].message.content };
  } catch (error) {
    console.error("Failed to invoke Mistral:", error);
    return { success: false, error: "Failed to get AI response" };
  }
} */
