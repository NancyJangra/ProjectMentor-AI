import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectExplanation, ProjectUnderstanding } from "@/types/project-analysis";

export async function generateProjectExplanation(
  projectUnderstanding: ProjectUnderstanding
): Promise<ProjectExplanation> {
  const promptText = buildPrompt(projectUnderstanding);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  return parseJsonResponse<ProjectExplanation>(rawResponseText);
}

function buildPrompt(projectUnderstanding: ProjectUnderstanding): string {
  return `You are helping a student prepare a clear, structural explanation of their project for a technical interview or viva.

Here are the facts about their project:
${JSON.stringify(projectUnderstanding, null, 2)}

Write a clear explanation covering how the project is actually built and how it works, in plain language a student could read aloud and understand every word of. Use the tech stack and architecture facts above, but explain like a teacher, not a textbook.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) with exactly these keys:
- "architectureOverview": how the major pieces of the system fit together (string)
- "workflow": the step-by-step process of how a user or developer interacts with the project (string)
- "dataFlow": how data moves through the system, from input to output (string)`;
}
