import type { ProjectExplanation } from "@/types/project-analysis";

interface ExplanationSectionProps {
  explanation: ProjectExplanation;
}

export function ExplanationSection({ explanation }: ExplanationSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-accent bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">How it works</h2>
      <div className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Architecture overview</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{explanation.architectureOverview}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Workflow</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{explanation.workflow}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Data flow</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{explanation.dataFlow}</p>
        </div>
      </div>
    </section>
  );
}
