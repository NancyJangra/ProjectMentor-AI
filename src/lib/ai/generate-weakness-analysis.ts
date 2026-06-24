import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectUnderstanding, ProjectWeakness } from "@/types/project-analysis";

interface RawWeakness {
  area: string;
  description: string;
}

export async function generateWeaknessAnalysis(
  projectUnderstanding: ProjectUnderstanding
): Promise<ProjectWeakness[]> {
  const promptText = buildPrompt(projectUnderstanding);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const rawWeaknesses = parseJsonResponse<RawWeakness[]>(rawResponseText);

  return rawWeaknesses.map((weakness) => ({
    id: crypto.randomUUID(),
    area: weakness.area,
    description: weakness.description,
  }));
}

function buildPrompt(projectUnderstanding: ProjectUnderstanding): string {
  return `You are a tough but fair technical interviewer reviewing this project:
${JSON.stringify(projectUnderstanding, null, 2)}

Identify realistic weaknesses or gaps in the project — the kind of thing an experienced interviewer would notice and ask about (for example: no authentication, no caching, no error handling for a specific case, no tests, no scalability plan, no input validation). Base these on what's actually missing from the facts above, not generic boilerplate criticism. List 4 to 6 weaknesses, ordered from most to least important.

Respond with ONLY a JSON array (no markdown code fences, no extra commentary) of objects with exactly these keys:
- "area": a short label for the weakness, e.g. "Authentication" (string)
- "description": one or two sentences explaining the specific gap and why it matters (string)`;
}
