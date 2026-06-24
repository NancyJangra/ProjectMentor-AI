import { getSupabaseClient } from "./supabase-client";
import { generateEmbedding } from "@/lib/ai/generate-embedding";
import { buildEmbeddingTextForProject } from "./build-embedding-text-for-project";
import { SUPABASE_PROJECTS_TABLE } from "@/lib/constants";
import type { ProjectAnalysis, SavedProject } from "@/types/project-analysis";

interface ProjectRow {
  id: string;
  title: string;
  analysis: ProjectAnalysis;
  created_at: string;
}

export async function saveProjectToLibrary(
  analysis: ProjectAnalysis,
  userId: string
): Promise<SavedProject> {
  const embeddingText = buildEmbeddingTextForProject(analysis);
  const embedding = await generateEmbedding(embeddingText);

  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient
    .from(SUPABASE_PROJECTS_TABLE)
    .insert({
      title: analysis.projectUnderstanding.title,
      analysis,
      embedding,
      user_id: userId,
    })
    .select("id, title, analysis, created_at")
    .single();

  if (error || !data) {
    throw new Error(`Failed to save project to Supabase: ${error?.message ?? "unknown error"}`);
  }

  return rowToSavedProject(data as ProjectRow);
}

function rowToSavedProject(row: ProjectRow): SavedProject {
  return {
    id: row.id,
    title: row.title,
    analysis: row.analysis,
    createdAt: row.created_at,
  };
}
