import { fetchRepoZipBuffer } from "@/lib/github/fetch-repo-zip";
import { findReadmeText } from "@/lib/github/find-readme-file";
import { runFullProjectAnalysis } from "@/lib/analysis-pipeline";
import { runCodeAnalysis } from "@/lib/code-analysis/run-code-analysis";
import type { GithubRepoAnalysisResult } from "@/types/project-analysis";

export async function runFullGithubRepoAnalysis(
  owner: string,
  repo: string
): Promise<GithubRepoAnalysisResult> {
  const zipBuffer = await fetchRepoZipBuffer(owner, repo);
  const readmeText = findReadmeText(zipBuffer);

  const [analysis, codeAnalysis] = await Promise.all([
    readmeText !== null ? runFullProjectAnalysis(readmeText) : Promise.resolve(null),
    runCodeAnalysis(zipBuffer),
  ]);

  return {
    repoFullName: `${owner}/${repo}`,
    analysis,
    codeAnalysis,
  };
}
