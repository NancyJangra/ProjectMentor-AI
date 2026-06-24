import { NextRequest, NextResponse } from "next/server";
import { parseGithubRepoUrl } from "@/lib/github/parse-github-repo-url";
import { runFullGithubRepoAnalysis } from "@/lib/github-repo-analysis-pipeline";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";

export async function POST(request: NextRequest) {
  const authClient = await createSupabaseServerAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to analyze a repository." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The request body must be valid JSON with a 'repoUrl' field." },
      { status: 400 }
    );
  }

  try {
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
    }

    const { repoUrl } = body as Record<string, unknown>;

    if (typeof repoUrl !== "string" || repoUrl.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty 'repoUrl' string is required." },
        { status: 400 }
      );
    }

    const parsed = parseGithubRepoUrl(repoUrl);

    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "That doesn't look like a valid GitHub repository URL. " +
            "Try 'https://github.com/owner/repo' or just 'owner/repo'.",
        },
        { status: 400 }
      );
    }

    const result = await runFullGithubRepoAnalysis(parsed.owner, parsed.repo);

    return NextResponse.json({ result });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while analyzing the repository.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
