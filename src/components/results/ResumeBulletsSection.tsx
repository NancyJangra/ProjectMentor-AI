import type { ResumeBullets } from "@/types/project-analysis";

interface ResumeBulletsSectionProps {
  resumeBullets: ResumeBullets;
}

export function ResumeBulletsSection({ resumeBullets }: ResumeBulletsSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-success bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">Resume bullets</h2>
      <ul className="space-y-2">
        {resumeBullets.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink">
            <span className="text-muted">–</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
