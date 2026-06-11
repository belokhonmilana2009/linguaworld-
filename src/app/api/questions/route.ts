import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get("levelId");

    const where = levelId ? { levelId } : {};

    const questions = await prisma.question.findMany({
      where: {
        ...where,
      },
      orderBy: [{ levelId: "asc" }, { order: "asc" }],
      select: {
        id: true,
        levelId: true,
        type: true,
        question: true,
        hint: true,
        explanation: true,
        audioPrompt: true,
        gifPrompt: true,
        imagePrompt: true,
        order: true,
        correctAnswer: true,
        acceptableAnswers: true,
      },
    });

    // Get user's answered questions for this level
    const userId = session.user.id;
    const answeredQuestions = await prisma.attempt.findMany({
      where: {
        userId,
        ...(levelId ? { question: { levelId } } : {}),
      },
      select: {
        questionId: true,
        correct: true,
        accuracy: true,
        correctAnswer: true,
        explanation: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const answeredMap = new Map(
      answeredQuestions.map((aq) => [aq.questionId, aq])
    );

    const questionsWithStatus = questions.map((q) => ({
      ...q,
      answered: answeredMap.has(q.id),
      result: answeredMap.get(q.id) || null,
    }));

    const stats = {
      total: questions.length,
      answered: answeredQuestions.length,
      correct: answeredQuestions.filter((aq) => aq.correct).length,
    };

    return NextResponse.json({ questions: questionsWithStatus, stats });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
