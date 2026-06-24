import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import {
  TEXT_GENERATION_MODEL,
  MAXIMUM_READINESS_SCORE,
  READINESS_SCORE_CATEGORIES,
} from "@/lib/constants";
import type {
  ProjectUnderstanding,
  ProjectWeakness,
  ReadinessScore,
} from "@/types/project-analysis";

type RawCategoryScores = Record<string, { score: number; justification: string }>;

export async function generateReadinessScore(
  projectUnderstanding: ProjectUnderstanding,
  weaknesses: ProjectWeakness[]
): Promise<ReadinessScore> {
  const promptText = buildPrompt(projectUnderstanding, weaknesses);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const rawCategoryScores = parseJsonResponse<RawCategoryScores>(rawResponseText);

  const categories = READINESS_SCORE_CATEGORIES.map((category) => ({
    category,
    score: clampScore(rawCategoryScores[category]?.score ?? 0),
    justification: rawCategoryScores[category]?.justification ?? "",
  }));

  const overallScore = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length
  );

  return { categories, overallScore };
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(MAXIMUM_READINESS_SCORE, Math.round(score)));
}

function buildPrompt(
  projectUnderstanding: ProjectUnderstanding,
  weaknesses: ProjectWeakness[]
): string {
  const weaknessList = weaknesses
    .map((weakness) => `- ${weakness.area}: ${weakness.description}`)
    .join("\n");

  return `You are assessing how ready a student is to discuss this project in an interview or viva, based on the project itself (not the student personally):
${JSON.stringify(projectUnderstanding, null, 2)}

Known weaknesses in the project:
${weaknessList}

Score the PROJECT (as evidence of the student's demonstrated knowledge) in each of these categories, from 0 to ${MAXIMUM_READINESS_SCORE}:
${READINESS_SCORE_CATEGORIES.map((category) => `- "${category}"`).join("\n")}

A low score means the project gives little evidence of strength in that category (e.g. a project with no auth and no rate limiting should score low on "Security Awareness"). A high score means the project clearly demonstrates strength there.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) mapping each category name exactly as written above to an object with:
- "score": a whole number from 0 to ${MAXIMUM_READINESS_SCORE}
- "justification": one sentence explaining the score`;
}
