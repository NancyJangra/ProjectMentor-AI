import { getSupabaseClient } from "./supabase-client";
import { generateEmbedding } from "@/lib/ai/generate-embedding";
import {
  NUMBER_OF_SEARCH_RESULTS_TO_RETURN,
  SUPABASE_MATCH_PROJECTS_FUNCTION,
} from "@/lib/constants";
import type { ProjectAnalysis, ProjectSearchResult } from "@/types/project-analysis";

interface MatchedProjectRow {
  id: string;
  title: string;
  analysis: ProjectAnalysis;
  created_at: string;
  similarity: number;
}

export async function searchProjectsBySimilarity(
  searchQuery: string,
  userId: string
): Promise<ProjectSearchResult[]> {
  const queryEmbedding = await generateEmbedding(searchQuery);

  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient.rpc(SUPABASE_MATCH_PROJECTS_FUNCTION, {
    query_embedding: queryEmbedding,
    match_count: NUMBER_OF_SEARCH_RESULTS_TO_RETURN,
    filter_user_id: userId,
  });

  if (error) {
    throw new Error(`Failed to search projects in Supabase: ${error.message}`);
  }

  return (data as MatchedProjectRow[]).map((row) => ({
    project: {
      id: row.id,
      title: row.title,
      analysis: row.analysis,
      createdAt: row.created_at,
    },
    similarity: row.similarity,
  }));
}
