"use client";

import { useEffect, useState } from "react";
import type { ProjectAnalysis } from "@/types/project-analysis";
import { ACCEPTED_DOCUMENT_FILE_EXTENSIONS } from "@/lib/constants";

interface FileUploadFormProps {
  /** Called with the result once analysis succeeds. */
  onAnalysisComplete: (analysis: ProjectAnalysis) => void;
}

/**
 * The upload form for Module 1, feature 1 (File upload).
 *
 * This component's only job is: let the person pick a file, send it to
 * our /api/analyze-project route, and report back what happened
 * (loading, error, or success). It doesn't know anything about how the
 * analysis itself works, or how many different generators run behind
 * the scenes — that's deliberately kept on the server.
 *
 * While waiting, the button cycles through status messages every few seconds
 * so the student knows the app is still working (the full analysis pipeline
 * can take 30–90 seconds depending on rate-limit retries).
 */
export function FileUploadForm({ onAnalysisComplete }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isAnalyzing) {
      setStatusIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % DOCUMENT_STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    // Only clear the flag when the pointer leaves the label entirely,
    // not when it moves over a child element inside the label.
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    setSelectedFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please choose a file first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/analyze-project", {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Analysis failed.");
      }

      onAnalysisComplete(responseBody.analysis);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        htmlFor="project-document"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-lg border-2 border-dashed bg-surface p-8 text-center transition-all duration-200 ${
          isDragging
            ? "scale-[1.02] border-accent bg-accentSoft shadow-glow-sm"
            : "border-muted/25 hover:border-accent/70 hover:shadow-glow-sm"
        }`}
      >
        <input
          id="project-document"
          type="file"
          accept={ACCEPTED_DOCUMENT_FILE_EXTENSIONS.join(",")}
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
        <span className="block font-mono text-sm text-muted">
          {selectedFile
            ? selectedFile.name
            : isDragging
            ? "Drop to select"
            : "Click or drag a file here"}
        </span>
        <span className="mt-1 block text-xs text-muted">
          {ACCEPTED_DOCUMENT_FILE_EXTENSIONS.join(" · ")}
        </span>
      </label>

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
        {isAnalyzing ? DOCUMENT_STATUS_MESSAGES[statusIndex] : "Analyze project"}
      </button>
    </form>
  );
}

const DOCUMENT_STATUS_MESSAGES = [
  "Reading your document…",
  "Extracting project details…",
  "Writing your introductions…",
  "Generating interview questions…",
  "Scoring your readiness…",
  "Polishing the results…",
] as const;
