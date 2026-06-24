import { NextRequest, NextResponse } from "next/server";
import { searchProjectsBySimilarity } from "@/lib/supabase/search-projects-by-similarity";
import { generateSearchMatchExplanation } from "@/lib/ai/generate-search-match-explanation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import type { ProjectSearchResponse } from "@/types/project-analysis";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createSupabaseServerAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as { query?: string };

    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json({ error: "Request body must include a 'query' string." }, { status: 400 });
    }

    const results = await searchProjectsBySimilarity(body.query, user.id);

    if (results.length === 0) {
      const response: ProjectSearchResponse = {
        results: [],
        explanation: "No saved projects were found. Analyze a project first and it will appear here automatically.",
      };
      return NextResponse.json({ response });
    }

    const explanation = await generateSearchMatchExplanation(body.query, results[0]);

    const response: ProjectSearchResponse = { results, explanation };

    return NextResponse.json({ response });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while searching the project library.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
