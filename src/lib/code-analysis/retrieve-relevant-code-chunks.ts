import { generateEmbedding, generateEmbeddingsForMany } from "@/lib/ai/generate-embedding";
import { calculateCosineSimilarity } from "@/lib/cosine-similarity";
import {
  NUMBER_OF_CODE_CHUNKS_TO_RETRIEVE,
  THEMATIC_CODE_RETRIEVAL_QUERIES,
} from "@/lib/constants";
import type { CodeChunk } from "./chunk-code-files";

export async function retrieveRelevantCodeChunks(chunks: CodeChunk[]): Promise<CodeChunk[]> {
  const chunkEmbeddings = await generateEmbeddingsForMany(chunks.map((chunk) => chunk.chunkText));

  const numberOfChunksPerTheme = Math.max(
    1,
    Math.ceil(NUMBER_OF_CODE_CHUNKS_TO_RETRIEVE / THEMATIC_CODE_RETRIEVAL_QUERIES.length)
  );

  const retrievedChunkIndexes = new Set<number>();

  for (const themeQuery of THEMATIC_CODE_RETRIEVAL_QUERIES) {
    const themeEmbedding = await generateEmbedding(themeQuery);

    const chunksRankedBySimilarity = chunkEmbeddings
      .map((chunkEmbedding, chunkIndex) => ({
        chunkIndex,
        similarity: calculateCosineSimilarity(themeEmbedding, chunkEmbedding),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    for (const ranked of chunksRankedBySimilarity.slice(0, numberOfChunksPerTheme)) {
      retrievedChunkIndexes.add(ranked.chunkIndex);
    }
  }

  return Array.from(retrievedChunkIndexes).map((chunkIndex) => chunks[chunkIndex]);
}
