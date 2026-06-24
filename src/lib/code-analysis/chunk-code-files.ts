import { CODE_CHUNK_SIZE_IN_CHARACTERS } from "@/lib/constants";
import type { CodebaseSourceFile } from "@/types/project-analysis";

/** One chunk of code, before it has been embedded. */
export interface CodeChunk {
  filePath: string;
  chunkText: string;
}

export function chunkCodeFiles(sourceFiles: CodebaseSourceFile[]): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const file of sourceFiles) {
    if (file.content.length <= CODE_CHUNK_SIZE_IN_CHARACTERS) {
      chunks.push({ filePath: file.filePath, chunkText: file.content });
      continue;
    }

    for (
      let startIndex = 0;
      startIndex < file.content.length;
      startIndex += CODE_CHUNK_SIZE_IN_CHARACTERS
    ) {
      const chunkText = file.content.slice(startIndex, startIndex + CODE_CHUNK_SIZE_IN_CHARACTERS);
      chunks.push({ filePath: file.filePath, chunkText });
    }
  }

  return chunks;
}
