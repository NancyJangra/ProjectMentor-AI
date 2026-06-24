import { NextRequest, NextResponse } from "next/server";
import { saveProjectToLibrary } from "@/lib/supabase/save-project";
import { listSavedProjects } from "@/lib/supabase/list-projects";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import type { ProjectAnalysis } from "@/types/project-analysis";

export async function GET() {
  try {
    const authClient = await createSupabaseServerAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const projects = await listSavedProjects(user.id);
    return NextResponse.json({ projects });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while loading the project library.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await createSupabaseServerAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as { analysis?: ProjectAnalysis };

    if (!body.analysis) {
      return NextResponse.json(
        { error: "Request body must include an 'analysis' object." },
        { status: 400 }
      );
    }

    const project = await saveProjectToLibrary(body.analysis, user.id);

    return NextResponse.json({ project });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while saving the project.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
