import { generateProjectUnderstanding } from "./ai/generate-project-understanding";
import { generateInterviewIntroductions } from "./ai/generate-interview-introductions";
import { generateProjectExplanation } from "./ai/generate-project-explanation";
import { generateInterviewQuestions } from "./ai/generate-interview-questions";
import { generateAnswersForQuestions } from "./ai/generate-answers-for-questions";
import { generateWeaknessAnalysis } from "./ai/generate-weakness-analysis";
import { generateImprovementSuggestions } from "./ai/generate-improvement-suggestions";
import { generateResumeBullets } from "./ai/generate-resume-bullets";
import { generateReadinessScore } from "./ai/generate-readiness-score";
import { generateLearningRoadmap } from "./ai/generate-learning-roadmap";
import type { InterviewQuestionWithAnswer, ProjectAnalysis } from "@/types/project-analysis";

export async function runFullProjectAnalysis(documentText: string): Promise<ProjectAnalysis> {
  const projectUnderstanding = await generateProjectUnderstanding(documentText);

  const [introductions, explanation, questions, weaknesses, resumeBullets] = await Promise.all([
    generateInterviewIntroductions(projectUnderstanding),
    generateProjectExplanation(projectUnderstanding),
    generateInterviewQuestions(projectUnderstanding),
    generateWeaknessAnalysis(projectUnderstanding),
    generateResumeBullets(projectUnderstanding),
  ]);

  const [answers, improvements] = await Promise.all([
    generateAnswersForQuestions(projectUnderstanding, questions),
    generateImprovementSuggestions(projectUnderstanding, weaknesses),
  ]);

  const questionsWithAnswers: InterviewQuestionWithAnswer[] = questions.map((question) => {
    const matchingAnswer = answers.find((answer) => answer.questionId === question.id);
    return {
      ...question,
      answer: matchingAnswer?.answer ?? "No answer was generated for this question.",
    };
  });

  const readinessScore = await generateReadinessScore(projectUnderstanding, weaknesses);
  const roadmap = await generateLearningRoadmap(projectUnderstanding, readinessScore);

  return {
    projectUnderstanding,
    introductions,
    explanation,
    questionsWithAnswers,
    weaknesses,
    improvements,
    resumeBullets,
    readinessScore,
    roadmap,
  };
}
