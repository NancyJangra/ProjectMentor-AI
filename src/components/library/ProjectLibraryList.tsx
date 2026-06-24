"use client";

import { useEffect, useState } from "react";
import type { SavedProject } from "@/types/project-analysis";

interface ProjectLibraryListProps {
  onSelectProject: (project: SavedProject) => void;
  /** Bumping this number tells the list to refetch (e.g. after a search selects a project). */
  refreshKey?: number;
}

export function ProjectLibraryList({ onSelectProject, refreshKey }: ProjectLibraryListProps) {
  const [projects, setProjects] = useState<SavedProject[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isStillMounted = true;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        const responseBody = await response.json();

        if (!response.ok) {
          throw new Error(responseBody.error ?? "Could not load the project library.");
        }

        if (isStillMounted) {
          setProjects(responseBody.projects);
        }
      } catch (error) {
        if (isStillMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
        }
      }
    }

    loadProjects();

    return () => {
      isStillMounted = false;
    };
  }, [refreshKey]);

  if (errorMessage) {
    return <p className="text-sm text-warning">{errorMessage}</p>;
  }

  if (!projects) {
    return <p className="text-sm text-muted">Loading your library…</p>;
  }

  if (projects.length === 0) {
    return <p className="text-sm text-muted">No projects yet. Analyses you run will appear here automatically.</p>;
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            onClick={() => onSelectProject(project)}
            className="flex w-full items-center justify-between rounded-md border border-muted/10 bg-surface p-3 text-left transition-all duration-150 hover:border-accent/50 hover:shadow-glow-sm"
          >
            <span className="text-sm font-medium text-ink">{project.title}</span>
            <span className="font-mono text-xs text-muted">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
