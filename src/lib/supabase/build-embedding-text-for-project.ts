import type { ProjectAnalysis } from "@/types/project-analysis";

export function buildEmbeddingTextForProject(analysis: ProjectAnalysis): string {
  const { projectUnderstanding, weaknesses } = analysis;

  const weaknessSummary = weaknesses.map((weakness) => weakness.area).join(", ");

  return [
    `Title: ${projectUnderstanding.title}`,
    `Objective: ${projectUnderstanding.objective}`,
    `Problem solved: ${projectUnderstanding.problemStatement}`,
    `Tech stack: ${projectUnderstanding.techStack.join(", ")}`,
    `Architecture: ${projectUnderstanding.architecture}`,
    `Methodology: ${projectUnderstanding.methodology}`,
    `Results: ${projectUnderstanding.results}`,
    `Known weaknesses: ${weaknessSummary}`,
  ].join("\n");
}
