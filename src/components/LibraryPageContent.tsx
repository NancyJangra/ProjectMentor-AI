"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { ProjectSearchBar } from "@/components/library/ProjectSearchBar";
import { SearchResultsView } from "@/components/library/SearchResultsView";
import { ProjectLibraryList } from "@/components/library/ProjectLibraryList";
import { AnalysisResultsView } from "@/components/results/AnalysisResultsView";
import type { ProjectSearchResponse, SavedProject } from "@/types/project-analysis";

interface LibraryPageContentProps {
  user: User;
}

export function LibraryPageContent({ user }: LibraryPageContentProps) {
  const [searchResponse, setSearchResponse] = useState<ProjectSearchResponse | null>(null);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);

  function handleSelectProjectById(projectId: string) {
    const matchFromSearch = searchResponse?.results.find(
      (result) => result.project.id === projectId
    );
    if (matchFromSearch) {
      setSelectedProject(matchFromSearch.project);
    }
  }

  if (selectedProject) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="text-sm font-medium text-accent hover:text-accentDark"
          >
            ← Back to recent projects
          </button>
          <div className="flex items-center gap-3">
            <UserMenu user={user} />
            <ThemeToggle />
          </div>
        </div>
        <AnalysisResultsView analysis={selectedProject.analysis} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-8">
        <div className="flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm font-medium text-accent hover:text-accentDark">
            ← Analyze a new project
          </Link>
          <div className="flex items-center gap-3">
            <UserMenu user={user} />
            <ThemeToggle />
          </div>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
          Recent projects
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Every project you&apos;ve analyzed, searchable by what it demonstrates.
        </p>
      </header>

      <div className="mb-8 print:hidden">
        <ProjectSearchBar onSearchComplete={setSearchResponse} />
        {searchResponse && (
          <SearchResultsView response={searchResponse} onSelectProject={handleSelectProjectById} />
        )}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Your projects</h2>
        <ProjectLibraryList onSelectProject={setSelectedProject} />
      </section>
    </main>
  );
}
