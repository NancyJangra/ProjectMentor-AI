import { getSupabaseClient } from "./supabase-client";
import { SUPABASE_PROJECTS_TABLE } from "@/lib/constants";
import type { ProjectAnalysis, SavedProject } from "@/types/project-analysis";

interface ProjectRow {
  id: string;
  title: string;
  analysis: ProjectAnalysis;
  created_at: string;
}

export async function listSavedProjects(userId: string): Promise<SavedProject[]> {
  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient
    .from(SUPABASE_PROJECTS_TABLE)
    .select("id, title, analysis, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list projects from Supabase: ${error.message}`);
  }

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    analysis: row.analysis,
    createdAt: row.created_at,
  }));
}
