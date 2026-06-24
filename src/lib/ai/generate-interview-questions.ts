import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import {
  TEXT_GENERATION_MODEL,
  INTERVIEW_QUESTION_DIFFICULTY_LEVELS,
  NUMBER_OF_QUESTIONS_PER_DIFFICULTY_LEVEL,
} from "@/lib/constants";
import type { InterviewQuestion, ProjectUnderstanding } from "@/types/project-analysis";

interface RawQuestionsByDifficulty {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
  expert: string[];
}

export async function generateInterviewQuestions(
  projectUnderstanding: ProjectUnderstanding
): Promise<InterviewQuestion[]> {
  const promptText = buildPrompt(projectUnderstanding);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const questionsByDifficulty =
    parseJsonResponse<RawQuestionsByDifficulty>(rawResponseText);

  return INTERVIEW_QUESTION_DIFFICULTY_LEVELS.flatMap((difficulty) =>
    questionsByDifficulty[difficulty].map((question) => ({
      id: crypto.randomUUID(),
      difficulty,
      question,
    }))
  );
}

function buildPrompt(projectUnderstanding: ProjectUnderstanding): string {
  return `You are an interviewer preparing questions to ask a student about their own project, in a technical interview or viva.

Here are the facts about their project:
${JSON.stringify(projectUnderstanding, null, 2)}

Write ${NUMBER_OF_QUESTIONS_PER_DIFFICULTY_LEVEL} interview questions for each of these four difficulty levels: ${INTERVIEW_QUESTION_DIFFICULTY_LEVELS.join(", ")}.
- "beginner" questions check basic understanding of what the project does.
- "intermediate" questions probe design decisions and how things actually work.
- "advanced" questions probe trade-offs, edge cases, and "why not X instead?" alternatives.
- "expert" questions probe scalability, security, and what you'd do differently at a much larger scale.

Make every question specific to THIS project — reference its actual tech stack and architecture, not generic interview questions.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) with exactly these keys, each an array of ${NUMBER_OF_QUESTIONS_PER_DIFFICULTY_LEVEL} question strings:
- "beginner"
- "intermediate"
- "advanced"
- "expert"`;
}
