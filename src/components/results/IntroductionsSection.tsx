import type { InterviewIntroductions } from "@/types/project-analysis";

interface IntroductionsSectionProps {
  introductions: InterviewIntroductions;
}

const INTRODUCTION_DISPLAY_ORDER: { key: keyof InterviewIntroductions; label: string }[] = [
  { key: "thirtySecondPitch", label: "30 seconds" },
  { key: "oneMinutePitch", label: "1 minute" },
  { key: "twoMinutePitch", label: "2 minutes" },
  { key: "hrFriendlyVersion", label: "HR / non-technical" },
  { key: "technicalVersion", label: "Technical interviewer" },
];

export function IntroductionsSection({ introductions }: IntroductionsSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-success bg-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink">Introductions</h2>
      <div className="space-y-5">
        {INTRODUCTION_DISPLAY_ORDER.map(({ key, label }) => (
          <div key={key}>
            <p className="font-mono text-xs uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{introductions[key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
