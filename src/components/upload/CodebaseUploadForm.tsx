"use client";

import { useEffect, useState } from "react";
import type { CodeAnalysisResult } from "@/types/project-analysis";

interface CodebaseUploadFormProps {
  onAnalysisComplete: (result: CodeAnalysisResult) => void;
}

/**
 * The upload form for Module 2 (Code Analysis). Lets a student upload
 * a .zip of their codebase and reports back the result, the same way
 * FileUploadForm does for a description document in Module 1.
 *
 * While waiting, the button cycles through status messages every few seconds
 * so the student knows the app is still working (large codebases that hit the
 * chunk + embed + retrieve path can take a while to process).
 */
export function CodebaseUploadForm({ onAnalysisComplete }: CodebaseUploadFormProps) {
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
      setStatusIndex((i) => (i + 1) % CODEBASE_STATUS_MESSAGES.length);
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
      setErrorMessage("Please choose a .zip file first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/analyze-codebase", {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Codebase analysis failed.");
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
      <label
        htmlFor="codebase-zip"
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
          id="codebase-zip"
          type="file"
          accept=".zip"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
        <span className="block font-mono text-sm text-muted">
          {selectedFile
            ? selectedFile.name
            : isDragging
            ? "Drop to select"
            : "Click or drag a .zip here"}
        </span>
        <span className="mt-1 block text-xs text-muted">.zip only</span>
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
        {isAnalyzing ? CODEBASE_STATUS_MESSAGES[statusIndex] : "Analyze codebase"}
      </button>
    </form>
  );
}

const CODEBASE_STATUS_MESSAGES = [
  "Unpacking your codebase…",
  "Reading source files…",
  "Analysing code architecture…",
  "Generating interview questions…",
  "Finishing up…",
] as const;
