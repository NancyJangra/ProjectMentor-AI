import { ProjectUnderstandingCard } from "./ProjectUnderstandingCard";
import { IntroductionsSection } from "./IntroductionsSection";
import { ExplanationSection } from "./ExplanationSection";
import { QuestionsSection } from "./QuestionsSection";
import { WeaknessesSection } from "./WeaknessesSection";
import { ResumeBulletsSection } from "./ResumeBulletsSection";
import { ReadinessScoreSection } from "./ReadinessScoreSection";
import { ExportToPdfButton } from "./ExportToPdfButton";
import type { ProjectAnalysis } from "@/types/project-analysis";

interface AnalysisResultsViewProps {
  analysis: ProjectAnalysis;
}

export function AnalysisResultsView({ analysis }: AnalysisResultsViewProps) {
  return (
    <div className="space-y-4">
      <div className="hidden print:block mb-6 border-b border-gray-300 pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
          ProjectMentor AI — Interview Prep Packet
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {analysis.projectUnderstanding.title}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <ExportToPdfButton />
      </div>

      <div className="space-y-4">
        <ProjectUnderstandingCard projectUnderstanding={analysis.projectUnderstanding} />
        <IntroductionsSection introductions={analysis.introductions} />
        <ExplanationSection explanation={analysis.explanation} />
      </div>

      <SectionDivider label="Practice" />

      <QuestionsSection
        projectUnderstanding={analysis.projectUnderstanding}
        questionsWithAnswers={analysis.questionsWithAnswers}
      />

      <SectionDivider label="Assessment" />

      <div className="space-y-4">
        <WeaknessesSection weaknesses={analysis.weaknesses} improvements={analysis.improvements} />
        <ReadinessScoreSection readinessScore={analysis.readinessScore} roadmap={analysis.roadmap} />
        <ResumeBulletsSection resumeBullets={analysis.resumeBullets} />
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
        {label}
      </span>
      <div className="h-px flex-1 bg-muted/10" />
    </div>
  );
}
