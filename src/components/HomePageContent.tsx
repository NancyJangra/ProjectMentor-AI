"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { FileUploadForm } from "@/components/upload/FileUploadForm";
import { CodebaseUploadForm } from "@/components/upload/CodebaseUploadForm";
import { GithubRepoForm } from "@/components/upload/GithubRepoForm";
import { AnalysisResultsView } from "@/components/results/AnalysisResultsView";
import { CodeAnalysisSection } from "@/components/results/CodeAnalysisSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { UserMenu } from "@/components/auth/UserMenu";
import type {
  CodeAnalysisResult,
  GithubRepoAnalysisResult,
  ProjectAnalysis,
} from "@/types/project-analysis";

type ActiveTab = "document" | "codebase" | "github";

const TAB_ORDER: ActiveTab[] = ["document", "codebase", "github"];

const TAB_LABELS: Record<ActiveTab, string> = {
  document: "Project description",
  codebase: "Codebase (.zip)",
  github: "GitHub repo",
};

const TAB_ILLUSTRATIONS: Record<ActiveTab, string> = {
  document: "/illustrations/reading.svg",
  codebase: "/illustrations/coding.svg",
  github: "/illustrations/github.svg",
};

interface HomePageContentProps {
  user: User | null;
}

export function HomePageContent({ user }: HomePageContentProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("document");
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [codeAnalysisResult, setCodeAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [githubRepoResult, setGithubRepoResult] = useState<GithubRepoAnalysisResult | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([null, null, null]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(
    null
  );
  useLayoutEffect(() => {
    if (!user) return;
    const el = tabRefs.current[TAB_ORDER.indexOf(activeTab)];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab, user]);

  if (!user) return <SignInScreen />;

  async function autoSave(projectAnalysis: ProjectAnalysis) {
    setAutoSaveStatus("saving");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: projectAnalysis }),
      });
      setAutoSaveStatus(response.ok ? "saved" : "error");
    } catch {
      setAutoSaveStatus("error");
    }
  }

  function handleDocumentAnalysisComplete(result: ProjectAnalysis) {
    setAutoSaveStatus("idle");
    setAnalysis(result);
    autoSave(result);
  }

  function handleCodebaseAnalysisComplete(result: CodeAnalysisResult) {
    setCodeAnalysisResult(result);
  }

  function handleGithubAnalysisComplete(result: GithubRepoAnalysisResult) {
    setAutoSaveStatus("idle");
    setGithubRepoResult(result);
    if (result.analysis) {
      autoSave(result.analysis);
    }
  }

  function handleTabChange(tab: ActiveTab) {
    setActiveTab(tab);
    setAutoSaveStatus("idle");
  }

  return (
    <main className="relative mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="hero-glow-blob animate-hero-glow pointer-events-none absolute -top-24 left-1/2 -z-10 h-[480px] w-[480px] rounded-full print:hidden"
      />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 print:hidden">

        <div className="min-w-0 flex-1">
          <header className="mb-10">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                ProjectMentor AI
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/library"
                  className="text-sm font-medium text-muted transition-colors duration-150 hover:text-accent"
                >
                  Recent projects →
                </Link>
                <UserMenu user={user} />
                <ThemeToggle />
              </div>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Get viva-ready on your own project
            </h1>

            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
              Upload your project description or codebase and get instant interview
              prep — questions, introductions, and a readiness score.
            </p>
          </header>

          <div className="relative mb-6 flex">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-muted/10" />
            {indicatorStyle !== null && (
              <div
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 bg-accent"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  transition: "left 0.25s ease, width 0.25s ease",
                }}
              />
            )}
            {TAB_ORDER.map((tab, i) => (
              <button
                key={tab}
                // eslint-disable-next-line no-return-assign
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`relative z-10 px-3 pb-2.5 pt-1 text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          {activeTab === "document" && (
            <FileUploadForm onAnalysisComplete={handleDocumentAnalysisComplete} />
          )}
          {activeTab === "codebase" && (
            <CodebaseUploadForm onAnalysisComplete={handleCodebaseAnalysisComplete} />
          )}
          {activeTab === "github" && (
            <GithubRepoForm onAnalysisComplete={handleGithubAnalysisComplete} />
          )}

          {autoSaveStatus === "saved" && (
            <p className="mt-3 text-xs text-muted/70">Saved to your recent projects.</p>
          )}
          {autoSaveStatus === "error" && (
            <p className="mt-3 text-xs text-warning/80">Could not auto-save this analysis.</p>
          )}
        </div>

        <div className="flex justify-center lg:shrink-0">
          <div className="animate-illus-float relative h-52 w-52 sm:h-60 sm:w-60">
            {TAB_ORDER.map((tab) => (
              <div
                key={tab}
                className="absolute inset-0"
                style={{
                  opacity: activeTab === tab ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                <Image
                  src={TAB_ILLUSTRATIONS[tab]}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                  priority={tab === "document"}
                  sizes="(max-width: 640px) 208px, 240px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "document" && analysis && (
        <div className="mx-auto mt-12 max-w-2xl">
          <AnalysisResultsView analysis={analysis} />
        </div>
      )}

      {activeTab === "codebase" && codeAnalysisResult && (
        <div className="mx-auto mt-12 max-w-2xl">
          <CodeAnalysisSection result={codeAnalysisResult} />
        </div>
      )}

      {activeTab === "github" && githubRepoResult && (
        <div className="mx-auto mt-12 max-w-2xl">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">
            {githubRepoResult.repoFullName}
          </p>

          {githubRepoResult.analysis !== null ? (
            <AnalysisResultsView analysis={githubRepoResult.analysis} />
          ) : (
            <div className="mb-6 rounded-lg border border-muted/10 border-l-2 border-l-muted bg-surface px-4 py-3 text-sm text-muted">
              No README found — showing code analysis only.
            </div>
          )}

          <div className={githubRepoResult.analysis !== null ? "mt-10" : ""}>
            <CodeAnalysisSection result={githubRepoResult.codeAnalysis} />
          </div>
        </div>
      )}
    </main>
  );
}
