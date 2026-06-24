"use client";

import { useEffect, useState } from "react";
import type { GithubRepoAnalysisResult } from "@/types/project-analysis";

interface GithubRepoFormProps {
  onAnalysisComplete: (result: GithubRepoAnalysisResult) => void;
}

/**
 * Input form for the GitHub repo analysis path. Unlike the file-upload
 * forms, this is just a text field — the student pastes a GitHub URL (or
 * a bare owner/repo shorthand) and hits submit.
 *
 * The button cycles through status messages while the pipeline runs
 * because fetching + analysing a repo can take 30–90 seconds.
 */
export function GithubRepoForm({ onAnalysisComplete }: GithubRepoFormProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setStatusIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % GITHUB_STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!repoUrl.trim()) {
      setErrorMessage("Please enter a GitHub repository URL.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze-github-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Repository analysis failed.");
      }

      onAnalysisComplete(responseBody.result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        placeholder="https://github.com/owner/repo"
        disabled={isAnalyzing}
        className="w-full rounded-lg border border-muted/25 bg-surface px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 transition-all duration-200 focus:border-accent/70 focus:outline-none focus:shadow-glow-sm disabled:opacity-60"
      />

      {errorMessage && (
        <p role="alert" className="text-sm text-warning">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-white transition-all duration-150 hover:bg-accentDark hover:shadow-glow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAnalyzing ? GITHUB_STATUS_MESSAGES[statusIndex] : "Analyze repository"}
      </button>
    </form>
  );
}

const GITHUB_STATUS_MESSAGES = [
  "Fetching repository from GitHub…",
  "Reading source files…",
  "Analysing README…",
  "Analysing code architecture…",
  "Generating interview questions…",
  "Scoring your readiness…",
  "Finishing up…",
] as const;
