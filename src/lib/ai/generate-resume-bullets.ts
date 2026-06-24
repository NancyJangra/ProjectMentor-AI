import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectUnderstanding, ResumeBullets } from "@/types/project-analysis";

export async function generateResumeBullets(
  projectUnderstanding: ProjectUnderstanding
): Promise<ResumeBullets> {
  const promptText = buildPrompt(projectUnderstanding);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  return parseJsonResponse<ResumeBullets>(rawResponseText);
}

function buildPrompt(projectUnderstanding: ProjectUnderstanding): string {
  return `You are a resume-writing expert who specializes in applicant tracking system (ATS) optimisation, working from this project:
${JSON.stringify(projectUnderstanding, null, 2)}

Write 3 to 5 resume bullet points for this project. Each bullet should:
- Start with a strong past-tense action verb (e.g. "Built," "Implemented," "Designed")
- Mention specific technologies from the tech stack where natural
- Focus on outcomes and concrete results, not just tasks
- Stay under 220 characters
- Avoid first-person pronouns ("I"), as resume bullets don't use them

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) with exactly this key:
- "bullets": an array of 3 to 5 bullet point strings`;
}
