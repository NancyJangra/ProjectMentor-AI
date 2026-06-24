import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type { InterviewQuestion, InterviewQuestionWithAnswer } from "@/types/project-analysis";

type RawAnswersById = Record<string, string>;

export async function generateAnswersForCodeQuestions(
  codeText: string,
  questions: InterviewQuestion[]
): Promise<InterviewQuestionWithAnswer[]> {
  const promptText = buildPrompt(codeText, questions);
  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);
  const answersById = parseJsonResponse<RawAnswersById>(rawResponseText);

  return questions.map((question) => ({
    ...question,
    answer: answersById[question.id] ?? "No answer was generated for this question.",
  }));
}

function buildPrompt(codeText: string, questions: InterviewQuestion[]): string {
  const questionList = questions
    .map((q) => `- id "${q.id}" (${q.difficulty}): ${q.question}`)
    .join("\n");

  return `You are helping a student prepare confident answers to code-specific interview questions about their own project.

Here is the source code you should ground every answer in:
"""
${codeText}
"""

Here are the questions, each with an id:
${questionList}

For each question, write a specific, honest suggested answer the student could give, speaking in first person ("I chose...", "I implemented..."). Reference real file names, function names, or code details from the source above wherever possible — do not invent anything that isn't supported by the code.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) mapping each question's id to its answer string, for example:
{ "${questions[0]?.id ?? "example-id"}": "answer text here", ... }`;
}
