import type { CodebaseSourceFile } from "@/types/project-analysis";

export function combineSourceFilesIntoLabelledText(sourceFiles: CodebaseSourceFile[]): string {
  return sourceFiles
    .map((file) => `--- File: ${file.filePath} ---\n${file.content}`)
    .join("\n\n");
}
