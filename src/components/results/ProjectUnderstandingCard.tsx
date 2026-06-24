import type { ProjectUnderstanding } from "@/types/project-analysis";

interface ProjectUnderstandingCardProps {
  projectUnderstanding: ProjectUnderstanding;
}

export function ProjectUnderstandingCard({
  projectUnderstanding,
}: ProjectUnderstandingCardProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-accent bg-surface p-6">
      <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-ink">
        {projectUnderstanding.title}
      </h2>

      <dl className="space-y-4">
        <Field label="objective" value={projectUnderstanding.objective} />
        <Field label="problem_statement" value={projectUnderstanding.problemStatement} />
        <Field label="architecture" value={projectUnderstanding.architecture} />
        <Field label="methodology" value={projectUnderstanding.methodology} />
        <Field label="results" value={projectUnderstanding.results} />

        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-muted">
            tech_stack
          </dt>
          <dd className="mt-1.5 flex flex-wrap gap-2">
            {projectUnderstanding.techStack.map((technology) => (
              <span
                key={technology}
                className="rounded-md bg-background px-2.5 py-1 font-mono text-xs text-ink"
              >
                {technology}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{value}</dd>
    </div>
  );
}
