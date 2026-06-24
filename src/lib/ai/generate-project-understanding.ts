import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectUnderstanding } from "@/types/project-analysis";

export async function generateProjectUnderstanding(
  documentText: string
): Promise<ProjectUnderstanding> {
  const promptText = buildProjectUnderstandingPrompt(documentText);

  const rawResponseText = await generateText(
    TEXT_GENERATION_MODEL,
    promptText
  );

  return parseJsonResponse<ProjectUnderstanding>(rawResponseText);
}

function buildProjectUnderstandingPrompt(documentText: string): string {
  return `You are an experienced technical interviewer reading a student's project description document before an interview or viva.

Read the document below and extract the following facts about the project. Be concrete and specific — avoid vague filler sentences. If something genuinely is not mentioned in the document, make a reasonable, clearly-labelled inference rather than inventing specifics.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) with exactly these keys:
- "title": the project's name (string)
- "objective": one or two plain sentences on what the project is (string)
- "problemStatement": what real problem this solves, and for whom (string)
- "techStack": an array of the languages, frameworks, libraries, and tools used (array of strings)
- "architecture": how the project is structured internally, e.g. layers, services, components (string)
- "methodology": the approach/process used to build it (string)
- "results": what the project actually achieved or produced, in concrete terms (string)

Project description document:
"""
${documentText}
"""`;
}
