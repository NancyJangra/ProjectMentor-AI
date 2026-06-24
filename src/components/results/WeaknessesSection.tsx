import type { ImprovementSuggestion, ProjectWeakness } from "@/types/project-analysis";

interface WeaknessesSectionProps {
  weaknesses: ProjectWeakness[];
  improvements: ImprovementSuggestion[];
}

export function WeaknessesSection({ weaknesses, improvements }: WeaknessesSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-warning bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">Weaknesses &amp; how to fix them</h2>

      <div className="space-y-4">
        {weaknesses.map((weakness) => {
          const matchingImprovement = improvements.find(
            (improvement) => improvement.relatedWeaknessId === weakness.id
          );

          return (
            <div key={weakness.id} className="rounded-md border-l-2 border-warning bg-background p-3">
              <p className="text-sm font-medium text-ink">{weakness.area}</p>
              <p className="mt-1 text-sm text-muted">{weakness.description}</p>
              {matchingImprovement && (
                <p className="mt-2 text-sm text-ink">
                  <span className="font-mono text-xs uppercase tracking-wide text-success">Fix: </span>
                  {matchingImprovement.suggestion}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
