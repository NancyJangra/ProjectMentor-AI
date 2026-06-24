import { getAIClient } from "./ai-client";
import { EMBEDDING_OUTPUT_DIMENSIONS, EMBEDDING_MODEL } from "@/lib/constants";

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getAIClient();

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_OUTPUT_DIMENSIONS,
  });

  const values = response.data[0]?.embedding;
  if (!values) throw new Error("OpenAI did not return an embedding.");
  return values;
}

export async function generateEmbeddingsForMany(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = getAIClient();

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    dimensions: EMBEDDING_OUTPUT_DIMENSIONS,
  });

  if (response.data.length !== texts.length) {
    throw new Error("OpenAI did not return an embedding for every text.");
  }

  return response.data.map((item) => {
    if (!item.embedding) throw new Error("OpenAI returned an embedding entry with no values.");
    return item.embedding;
  });
}
