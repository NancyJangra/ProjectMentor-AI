import { NextRequest, NextResponse } from "next/server";
import { generateFollowUpQuestion } from "@/lib/ai/generate-follow-up-question";
import type { ProjectUnderstanding } from "@/types/project-analysis";

interface FollowUpQuestionRequestBody {
  projectUnderstanding: ProjectUnderstanding;
  originalQuestion: string;
  studentsAnswer: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<FollowUpQuestionRequestBody>;

    if (!body.projectUnderstanding || !body.originalQuestion || !body.studentsAnswer) {
      return NextResponse.json(
        {
          error:
            "Request body must include projectUnderstanding, originalQuestion, and studentsAnswer.",
        },
        { status: 400 }
      );
    }

    const followUpQuestion = await generateFollowUpQuestion(
      body.projectUnderstanding,
      body.originalQuestion,
      body.studentsAnswer
    );

    return NextResponse.json({ followUpQuestion });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong while generating a follow-up question.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
