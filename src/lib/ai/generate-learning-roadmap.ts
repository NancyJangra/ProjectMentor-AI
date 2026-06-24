import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type {
  LearningRoadmap,
  ProjectUnderstanding,
  ReadinessScore,
} from "@/types/project-analysis";

type RawRecommendationsByCategory = Record<string, string>;

export async function generateLearningRoadmap(
  projectUnderstanding: ProjectUnderstanding,
  readinessScore: ReadinessScore
): Promise<LearningRoadmap> {
  const promptText = buildPrompt(projectUnderstanding, readinessScore);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const recommendationsByCategory =
    parseJsonResponse<RawRecommendationsByCategory>(rawResponseText);

  const items = readinessScore.categories.map((categoryResult) => ({
    category: categoryResult.category,
    recommendation:
      recommendationsByCategory[categoryResult.category] ??
      "No recommendation was generated for this category.",
  }));

  return { items };
}

function buildPrompt(
  projectUnderstanding: ProjectUnderstanding,
  readinessScore: ReadinessScore
): string {
  const scoreList = readinessScore.categories
    .map((categoryResult) => `- "${categoryResult.category}": ${categoryResult.score}/100 — ${categoryResult.justification}`)
    .join("\n");

  return `You are creating a short, personalized study plan for a student preparing to discuss this project in an interview:
${JSON.stringify(projectUnderstanding, null, 2)}

Their readiness scores per category were:
${scoreList}

For each category, write one specific, actionable recommendation for what the student should study or build before their interview. Categories that scored lower should get more concrete, hands-on recommendations (e.g. "add JWT-based authentication to the login route and be ready to explain why"); categories that scored higher can get a lighter recommendation (e.g. a specific follow-up question to be ready for).

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) mapping each category name exactly as written above to one recommendation string.`;
}
