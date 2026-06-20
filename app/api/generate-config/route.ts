import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/openAi";

const PROMPT = `from this flow, generate an agent instruction prompt with all the details along with tools and all settings info in JSON format. DO NOT add any extra text, just the written JSON data. Make sure mentioned parameters depend on GET or POST request only: { systemPrompt:'', primaryAgentName:'', "agents": [{"id": "agent-id", "name": "", model: "", "includeHistory": true|false, "output": "", "tools": ["tools-id"], instructions: ""}], "tools": [{ "id": "id", "name": "", "description": "", "method": "GET"|"POST", "url": "", "includeApiKey": true, "apiKey": "", "parameters": { "key": "dataType"}, "usage": [ ], "assignedAgent": ""}]}`;

export async function POST(req: NextRequest) {
  const { generatedWorkflow } = await req.json();

  const response = await openai.responses.create({
    model: "google/gemma-4-31b-it:free",
    input: JSON.stringify(generatedWorkflow) + PROMPT,
  });

  const output = response.output_text;

  let parsedJson;

  try {
    parsedJson = JSON.parse(output.replace("```json", "").replace("```", ""));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse JSON", details: error },
      { status: 500 },
    );
  }
  return NextResponse.json(parsedJson);
}
