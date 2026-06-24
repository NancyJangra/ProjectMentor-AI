import OpenAI from "openai";
import { getEncoding } from "js-tiktoken";
import { callWithRetry } from "./retry-with-backoff";

let cachedClient: OpenAI | null = null;
let cachedEncoder: ReturnType<typeof getEncoding> | null = null;

export function getAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env.local file."
    );
  }

  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

export async function generateText(
  modelName: string,
  promptText: string
): Promise<string> {
  const client = getAIClient();

  const response = await callWithRetry(() =>
    client.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: promptText }],
    })
  );

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty response.");
  return text;
}

export async function countTokens(
  _modelName: string,
  text: string
): Promise<number> {
  if (!cachedEncoder) cachedEncoder = getEncoding("cl100k_base");
  return cachedEncoder.encode(text).length;
}
