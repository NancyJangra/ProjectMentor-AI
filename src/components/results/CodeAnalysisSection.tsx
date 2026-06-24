"use client";

import { useState } from "react";
import { INTERVIEW_QUESTION_DIFFICULTY_LEVELS, MAXIMUM_TOKENS_FOR_DIRECT_CODE_ANALYSIS } from "@/lib/constants";
import type { CodeAnalysisResult, InterviewQuestionWithAnswer } from "@/types/project-analysis";

interface CodeAnalysisSectionProps {
  result: CodeAnalysisResult;
}

export function CodeAnalysisSection({ result }: CodeAnalysisSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-accent bg-surface p-6">
      <h2 className="mb-2 font-display text-lg font-semibold tracking-tight text-ink">
        Codebase questions
      </h2>

      <p className="mb-4 font-mono text-xs text-muted">
        {result.numberOfFilesRead} files read · {result.totalTokensInCodebase.toLocaleString()} tokens ·{" "}
        {result.analysisMethod === "direct" ? (
          <>sent directly (under the {MAXIMUM_TOKENS_FOR_DIRECT_CODE_ANALYSIS.toLocaleString()}-token threshold)</>
        ) : (
          <>chunked + embedded + retrieved (codebase was over the token threshold)</>
        )}
      </p>

      <div className="space-y-5">
        {INTERVIEW_QUESTION_DIFFICULTY_LEVELS.map((difficulty) => {
          const questionsAtThisLevel = result.questions.filter(
            (q) => q.difficulty === difficulty
          );

          if (questionsAtThisLevel.length === 0) return null;

          return (
            <div key={difficulty}>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                {difficulty}
              </p>
              <div className="space-y-2.5">
                {questionsAtThisLevel.map((question) => (
                  <CodeQuestionItem key={question.id} question={question} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const DIFFICULTY_BADGE_CLASSES: Record<string, string> = {
  beginner:     "border-success/25 bg-success/10 text-success",
  intermediate: "border-accent/25 bg-accent/10 text-accent",
  advanced:     "border-warning/25 bg-warning/10 text-warning",
  expert:       "border-ink/20 bg-ink/10 text-ink/70",
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colorClasses =
    DIFFICULTY_BADGE_CLASSES[difficulty] ?? "border-muted/20 bg-muted/10 text-muted";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${colorClasses}`}
    >
      {difficulty}
    </span>
  );
}

function CodeQuestionItem({ question }: { question: InterviewQuestionWithAnswer }) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div className="rounded-md border border-muted/10 p-3 transition-colors duration-150 hover:border-accent/25">
      <div className="flex items-start gap-2.5">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-sm font-medium leading-snug text-ink">{question.question}</span>
      </div>

      <button
        type="button"
        onClick={() => setIsAnswerVisible((v) => !v)}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-150 ${isAnswerVisible ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {isAnswerVisible ? "Hide answer" : "Show suggested answer"}
      </button>

      {isAnswerVisible && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{question.answer}</p>
      )}
    </div>
  );
}
