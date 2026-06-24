"use client";

import { useState } from "react";
import type { ProjectUnderstanding } from "@/types/project-analysis";

interface FollowUpPracticeProps {
  projectUnderstanding: ProjectUnderstanding;
  question: string;
}

export function FollowUpPractice({ projectUnderstanding, question }: FollowUpPracticeProps) {
  const [studentsAnswer, setStudentsAnswer] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGetFollowUp() {
    if (studentsAnswer.trim().length === 0) {
      setErrorMessage("Type your answer first, then ask for a follow-up.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/follow-up-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectUnderstanding,
          originalQuestion: question,
          studentsAnswer,
        }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Could not generate a follow-up question.");
      }

      setFollowUpQuestion(responseBody.followUpQuestion);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <div className="rounded-md bg-accentSoft p-3 print:hidden">
        <textarea
          value={studentsAnswer}
          onChange={(event) => setStudentsAnswer(event.target.value)}
          placeholder="Practice: type your own answer here…"
          rows={2}
          className="w-full resize-none rounded-md border border-muted/30 bg-surface p-2 text-sm text-ink placeholder:text-muted/70"
        />

        <button
          type="button"
          onClick={handleGetFollowUp}
          disabled={isLoading}
          className="mt-2 text-xs font-medium text-accent hover:text-accentDark disabled:opacity-60"
        >
          {isLoading ? "Thinking of a follow-up…" : "Get a follow-up question →"}
        </button>

        {errorMessage && <p className="mt-2 text-xs text-warning">{errorMessage}</p>}

        {followUpQuestion && (
          <p className="mt-2 border-l-2 border-accent pl-2 text-sm text-ink">
            {followUpQuestion}
          </p>
        )}
      </div>

      {followUpQuestion && (
        <p className="hidden print:block mt-2 border-l-2 border-l-accent pl-2 text-sm text-gray-700">
          <span className="font-mono text-xs uppercase tracking-wide text-green-700">
            Follow-up:{" "}
          </span>
          {followUpQuestion}
        </p>
      )}
    </div>
  );
}
