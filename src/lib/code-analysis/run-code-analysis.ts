import { extractSourceFilesFromZip } from "@/lib/code-analysis/extract-zip-files";
import { combineSourceFilesIntoLabelledText } from "@/lib/code-analysis/combine-source-files";
import { chunkCodeFiles } from "@/lib/code-analysis/chunk-code-files";
import { retrieveRelevantCodeChunks } from "@/lib/code-analysis/retrieve-relevant-code-chunks";
import { generateCodeQuestions } from "@/lib/ai/generate-code-questions";
import { generateAnswersForCodeQuestions } from "@/lib/ai/generate-answers-for-code-questions";
import { countTokens } from "@/lib/ai/ai-client";
import {
  TEXT_GENERATION_MODEL,
  MAXIMUM_TOKENS_FOR_DIRECT_CODE_ANALYSIS,
} from "@/lib/constants";
import type { CodeAnalysisResult } from "@/types/project-analysis";

export async function runCodeAnalysis(zipBuffer: Buffer): Promise<CodeAnalysisResult> {
  const sourceFiles = extractSourceFilesFromZip(zipBuffer);

  if (sourceFiles.length === 0) {
    throw new Error("No readable source code files were found in this repository.");
  }

  const fullCodeText = combineSourceFilesIntoLabelledText(sourceFiles);
  const totalTokensInCodebase = await countTokens(
    TEXT_GENERATION_MODEL,
    fullCodeText
  );

  let codeTextToAnalyze: string;
  let analysisMethod: CodeAnalysisResult["analysisMethod"];

  if (totalTokensInCodebase <= MAXIMUM_TOKENS_FOR_DIRECT_CODE_ANALYSIS) {
    codeTextToAnalyze = fullCodeText;
    analysisMethod = "direct";
  } else {
    const chunks = chunkCodeFiles(sourceFiles);
    const relevantChunks = await retrieveRelevantCodeChunks(chunks);
    codeTextToAnalyze = relevantChunks
      .map((chunk) => `--- File: ${chunk.filePath} ---\n${chunk.chunkText}`)
      .join("\n\n");
    analysisMethod = "chunked-retrieval";
  }

  const questions = await generateCodeQuestions(codeTextToAnalyze);
  const questionsWithAnswers = await generateAnswersForCodeQuestions(codeTextToAnalyze, questions);

  return {
    questions: questionsWithAnswers,
    analysisMethod,
    totalTokensInCodebase,
    numberOfFilesRead: sourceFiles.length,
  };
}
