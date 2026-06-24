import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type {
  ImprovementSuggestion,
  ProjectUnderstanding,
  ProjectWeakness,
} from "@/types/project-analysis";

type RawSuggestionsByWeaknessId = Record<string, string>;

export async function generateImprovementSuggestions(
  projectUnderstanding: ProjectUnderstanding,
  weaknesses: ProjectWeakness[]
): Promise<ImprovementSuggestion[]> {
  const promptText = buildPrompt(projectUnderstanding, weaknesses);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const suggestionsByWeaknessId =
    parseJsonResponse<RawSuggestionsByWeaknessId>(rawResponseText);

  return weaknesses.map((weakness) => ({
    relatedWeaknessId: weakness.id,
    suggestion:
      suggestionsByWeaknessId[weakness.id] ?? "No suggestion was generated for this weakness.",
  }));
}

function buildPrompt(
  projectUnderstanding: ProjectUnderstanding,
  weaknesses: ProjectWeakness[]
): string {
  const weaknessList = weaknesses
    .map((weakness) => `- id "${weakness.id}": ${weakness.area} — ${weakness.description}`)
    .join("\n");

  return `You are advising a student on how to improve their project before a technical interview, given this project:
${JSON.stringify(projectUnderstanding, null, 2)}

Here are the weaknesses already identified, each with an id:
${weaknessList}

For each weakness, suggest one concrete, specific fix the student could realistically implement — name actual techniques, libraries, or patterns where relevant, not vague advice like "improve security."

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) mapping each weakness's id directly to its suggestion string, for example:
{ "${weaknesses[0]?.id ?? "example-id"}": "suggestion text here", ... }`;
}
