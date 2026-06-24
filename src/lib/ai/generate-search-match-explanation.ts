import { generateText } from "./ai-client";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectSearchResult } from "@/types/project-analysis";

export async function generateSearchMatchExplanation(
  searchQuery: string,
  bestMatch: ProjectSearchResult
): Promise<string> {
  const promptText = buildPrompt(searchQuery, bestMatch);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  return rawResponseText.trim();
}

function buildPrompt(searchQuery: string, bestMatch: ProjectSearchResult): string {
  const { projectUnderstanding } = bestMatch.project.analysis;

  return `A student searched their project library with this question: "${searchQuery}"

The best-matching project found was:
${JSON.stringify(projectUnderstanding, null, 2)}

Write a short, specific explanation (2-4 sentences) of why this project is a strong match for that question. Reference concrete facts from the project (the tech stack, architecture, or results) rather than speaking in generalities.

Respond with ONLY the explanation text, no preamble, no quotation marks, no commentary.`;
}
