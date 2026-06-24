import { generateText } from "@/lib/ai/ai-client";
import { parseJsonResponse } from "@/lib/ai/parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { InterviewQuestion } from "@/types/project-analysis";

interface RawCodeQuestion {
  difficulty: InterviewQuestion["difficulty"];
  question: string;
}

export async function generateCodeQuestions(codeText: string): Promise<InterviewQuestion[]> {
  const promptText = buildPrompt(codeText);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const rawQuestions = parseJsonResponse<RawCodeQuestion[]>(rawResponseText);

  return rawQuestions.map((rawQuestion) => ({
    id: crypto.randomUUID(),
    difficulty: rawQuestion.difficulty,
    question: rawQuestion.question,
  }));
}

function buildPrompt(codeText: string): string {
  return `You are a technical interviewer who has just read through a student's source code. Ask questions that prove whether they actually wrote and understand this code — not generic programming trivia.

Focus on:
- Specific design choices visible in the code (why this structure, this pattern, this library)
- Complexity: any non-trivial algorithms, loops, or logic
- Walkthroughs: "explain what happens when..." questions about a specific function or flow you can see in the code

Reference real file names, function names, or variable names from the code below wherever possible.

Source code:
"""
${codeText}
"""

Write 8 to 12 questions across difficulty levels "beginner", "intermediate", "advanced", and "expert".

Respond with ONLY a JSON array (no markdown code fences, no extra commentary) of objects with exactly these keys:
- "difficulty": one of "beginner", "intermediate", "advanced", "expert"
- "question": the question text, referencing specifics from the code`;
}
