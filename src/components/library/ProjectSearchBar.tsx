"use client";

import { useState } from "react";
import type { ProjectSearchResponse } from "@/types/project-analysis";

interface ProjectSearchBarProps {
  onSearchComplete: (response: ProjectSearchResponse) => void;
}

export function ProjectSearchBar({ onSearchComplete }: ProjectSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (query.trim().length === 0) {
      setErrorMessage("Type a question to search your library.");
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/search-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? "Search failed.");
      }

      onSearchComplete(responseBody.response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Which project best shows backend skills?"
          className="flex-1 rounded-lg border border-muted/30 bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-accentDark hover:shadow-glow-sm active:scale-[0.98] disabled:opacity-60"
        >
          {isSearching ? "Searching…" : "Search"}
        </button>
      </form>
      {errorMessage && <p className="mt-2 text-sm text-warning">{errorMessage}</p>}
    </div>
  );
}
