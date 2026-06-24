import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { InterviewIntroductions, ProjectUnderstanding } from "@/types/project-analysis";

export async function generateInterviewIntroductions(
  projectUnderstanding: ProjectUnderstanding
): Promise<InterviewIntroductions> {
  const promptText = buildPrompt(projectUnderstanding);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  return parseJsonResponse<InterviewIntroductions>(rawResponseText);
}

function buildPrompt(projectUnderstanding: ProjectUnderstanding): string {
  return `You are coaching a student on how to introduce their project in an interview or viva.

Here are the facts about their project:
${JSON.stringify(projectUnderstanding, null, 2)}

Write five different introductions the student could use, depending on the situation. Speak in first person ("I built...", "My project..."), as if the student is speaking. Be specific and confident, not generic.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) with exactly these keys:
- "thirtySecondPitch": a ~30 second spoken introduction (string)
- "oneMinutePitch": a ~1 minute spoken introduction with a bit more detail (string)
- "twoMinutePitch": a ~2 minute spoken introduction covering motivation, approach, and outcome (string)
- "hrFriendlyVersion": a non-technical version for an HR or recruiter screen, avoiding jargon (string)
- "technicalVersion": a version aimed at a technical interviewer, using correct technical terms from the tech stack (string)`;
}
