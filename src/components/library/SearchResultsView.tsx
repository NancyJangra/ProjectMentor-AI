import type { ProjectSearchResponse } from "@/types/project-analysis";

interface SearchResultsViewProps {
  response: ProjectSearchResponse;
  onSelectProject: (projectId: string) => void;
}

export function SearchResultsView({ response, onSelectProject }: SearchResultsViewProps) {
  if (response.results.length === 0) {
    return <p className="mt-4 text-sm text-muted">{response.explanation}</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="rounded-md bg-accentSoft p-3 text-sm leading-relaxed text-ink">
        <span className="font-mono text-xs uppercase tracking-wide text-success">Best match: </span>
        {response.explanation}
      </p>

      <div className="space-y-2">
        {response.results.map((result) => (
          <button
            key={result.project.id}
            type="button"
            onClick={() => onSelectProject(result.project.id)}
            className="flex w-full items-center justify-between rounded-md border border-muted/10 bg-surface p-3 text-left transition-all duration-150 hover:border-accent/50 hover:shadow-glow-sm"
          >
            <span className="text-sm font-medium text-ink">{result.project.title}</span>
            <span className="font-mono text-xs text-muted">
              {Math.round(result.similarity * 100)}% match
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
