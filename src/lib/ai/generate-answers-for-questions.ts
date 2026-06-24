import { generateText } from "./ai-client";
import { parseJsonResponse } from "./parse-json-response";
import { TEXT_GENERATION_MODEL } from "@/lib/constants";
import type {
  InterviewQuestion,
  InterviewQuestionAnswer,
  ProjectUnderstanding,
} from "@/types/project-analysis";

type RawAnswersById = Record<string, string>;

export async function generateAnswersForQuestions(
  projectUnderstanding: ProjectUnderstanding,
  questions: InterviewQuestion[]
): Promise<InterviewQuestionAnswer[]> {
  const promptText = buildPrompt(projectUnderstanding, questions);

  const rawResponseText = await generateText(TEXT_GENERATION_MODEL, promptText);

  const answersById = parseJsonResponse<RawAnswersById>(rawResponseText);

  return questions.map((question) => ({
    questionId: question.id,
    answer: answersById[question.id] ?? "No answer was generated for this question.",
  }));
}

function buildPrompt(
  projectUnderstanding: ProjectUnderstanding,
  questions: InterviewQuestion[]
): string {
  const questionList = questions
    .map((question) => `- id "${question.id}" (${question.difficulty}): ${question.question}`)
    .join("\n");

  return `You are helping a student prepare strong, honest answers to interview questions about their own project.

Here are the facts about their project:
${JSON.stringify(projectUnderstanding, null, 2)}

Here are the questions, each with an id:
${questionList}

For each question, write a confident, specific suggested answer the student could give, speaking in first person ("I chose...", "I implemented..."). Ground every answer in the actual project facts above — don't invent details that aren't supported by them.

Respond with ONLY a JSON object (no markdown code fences, no extra commentary) mapping each question's id directly to its answer string, for example:
{ "${questions[0]?.id ?? "example-id"}": "answer text here", ... }`;
}
