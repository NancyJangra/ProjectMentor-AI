import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/file-parsing/extract-text-from-file";
import { runFullProjectAnalysis } from "@/lib/analysis-pipeline";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth-client";
import {
  ACCEPTED_DOCUMENT_FILE_EXTENSIONS,
  MAXIMUM_UPLOAD_FILE_SIZE_IN_BYTES,
} from "@/lib/constants";

export async function POST(request: NextRequest) {
  const authClient = await createSupabaseServerAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to analyze a project." },
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
        { error: "No file was uploaded. Please attach a project description document." },
        { status: 400 }
      );
    }

    if (uploadedFile.size > MAXIMUM_UPLOAD_FILE_SIZE_IN_BYTES) {
      const maximumSizeInMegabytes = MAXIMUM_UPLOAD_FILE_SIZE_IN_BYTES / (1024 * 1024);
      return NextResponse.json(
        { error: `File is too large. The maximum allowed size is ${maximumSizeInMegabytes} MB.` },
        { status: 400 }
      );
    }

    if (!hasAcceptedFileExtension(uploadedFile.name)) {
      return NextResponse.json(
        {
          error: `Unsupported file type. Please upload one of: ${ACCEPTED_DOCUMENT_FILE_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const extractedDocument = await extractTextFromFile(fileBuffer, uploadedFile.name);

    const analysis = await runFullProjectAnalysis(extractedDocument.text);

    return NextResponse.json({ analysis });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while analyzing the project.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function hasAcceptedFileExtension(fileName: string): boolean {
  const lowercaseFileName = fileName.toLowerCase();
  return ACCEPTED_DOCUMENT_FILE_EXTENSIONS.some((extension) =>
    lowercaseFileName.endsWith(extension)
  );
}
