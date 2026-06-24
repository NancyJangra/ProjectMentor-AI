"use client";

import { useEffect, useState } from "react";
import { MAXIMUM_READINESS_SCORE } from "@/lib/constants";
import type { LearningRoadmap, ReadinessScore } from "@/types/project-analysis";

interface ReadinessScoreSectionProps {
  readinessScore: ReadinessScore;
  roadmap: LearningRoadmap;
}

export function ReadinessScoreSection({ readinessScore, roadmap }: ReadinessScoreSectionProps) {
  return (
    <section className="rounded-lg border border-muted/10 border-l-2 border-l-accent bg-surface p-6">
      <div className="mb-6 flex items-center gap-5">
        <ScoreRing score={readinessScore.overallScore} />
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            Readiness score
          </h2>
          <p className="mt-0.5 text-sm text-muted">Overall interview readiness</p>
        </div>
      </div>

      <div className="space-y-5">
        {readinessScore.categories.map((categoryResult) => {
          const roadmapItem = roadmap.items.find(
            (item) => item.category === categoryResult.category
          );

          return (
            <div key={categoryResult.category}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-ink">{categoryResult.category}</p>
                <p className="font-mono text-xs text-muted">
                  {categoryResult.score}/{MAXIMUM_READINESS_SCORE}
                </p>
              </div>

              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${categoryResult.score}%` }}
                />
              </div>

              <p className="mt-1.5 text-xs text-muted">{categoryResult.justification}</p>

              {roadmapItem && (
                <p className="mt-1 text-sm text-ink">
                  <span className="font-mono text-xs uppercase tracking-wide text-success">
                    Next step:{" "}
                  </span>
                  {roadmapItem.recommendation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const strokeWidth = 5;
  const center = 44;
  const size = 88;
  const circumference = 2 * Math.PI * radius;

  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference * (1 - score / 100));
    }, 150);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: "var(--shadow-score-ring)" }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted/20"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)" }}
          className="stroke-accent"
        />
      </svg>
      <div className="absolute text-center" aria-label={`${score} out of 100`}>
        <p className="font-mono text-2xl font-bold leading-none text-accent">{score}</p>
        <p className="font-mono text-[10px] text-muted">/100</p>
      </div>
    </div>
  );
}
