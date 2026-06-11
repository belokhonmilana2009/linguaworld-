import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAnswer } from "@/lib/ai";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, userAnswer, levelId } = await request.json();

    if (!questionId || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Determine strictness based on level
    const levelStrictnessMap: Record<string, "soft" | "medium" | "strict"> = {
      A0: "soft",
      A1: "soft",
      A2: "soft",
      B1: "medium",
      B2: "medium",
      C1: "strict",
      C2: "strict",
    };

    const strictness = levelStrictnessMap[question.levelId] || "soft";

    const result = await checkAnswer(
      question.question,
      userAnswer,
      question.correctAnswer,
      question.acceptableAnswers,
      strictness
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/check error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
