import { NextRequest, NextResponse } from "next/server";
import { runCodeAnalysis } from "@/lib/code-analysis/run-code-analysis";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import { MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const authClient = await createSupabaseServerAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to analyze a codebase." },
      { status: 401 }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The request must be sent as multipart/form-data with a 'file' field." },
      { status: 400 }
    );
  }

  try {
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        { error: "No file was uploaded. Please attach a .zip of your codebase." },
        { status: 400 }
      );
    }

    if (uploadedFile.size > MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES) {
      const maximumSizeInMegabytes = MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES / (1024 * 1024);
      return NextResponse.json(
        { error: `File is too large. The maximum allowed size is ${maximumSizeInMegabytes} MB.` },
        { status: 400 }
      );
    }

    if (!uploadedFile.name.toLowerCase().endsWith(".zip")) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a .zip file." },
        { status: 400 }
      );
    }

    const zipBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const result = await runCodeAnalysis(zipBuffer);

    return NextResponse.json({ result });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while analyzing the codebase.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
