import { generateText } from "./ai-client";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { ProjectUnderstanding } from "@/types/project-analysis";

export async function generateFollowUpQuestion(
  projectUnderstanding: ProjectUnderstanding,
  originalQuestion: string,
  studentsAnswer: string
): Promise<string> {
  const promptText = buildPrompt(projectUnderstanding, originalQuestion, studentsAnswer);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  return rawResponseText.trim();
}

function buildPrompt(
  projectUnderstanding: ProjectUnderstanding,
  originalQuestion: string,
  studentsAnswer: string
): string {
  return `You are an interviewer in a live technical interview about this project:
${JSON.stringify(projectUnderstanding, null, 2)}

You just asked: "${originalQuestion}"
The student answered: "${studentsAnswer}"

Ask ONE natural follow-up question that digs one level deeper into their answer — the way a real interviewer would react to what they just said. Do not repeat the original question. Respond with ONLY the follow-up question itself, no preamble, no quotation marks, no commentary.`;
}
