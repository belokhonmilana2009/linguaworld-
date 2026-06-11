import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    let progress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: { userId },
      });
    }

    const totalQuestions = await prisma.question.count();
    const correctAnswers = await prisma.attempt.count({
      where: { userId, correct: true },
    });
    const wrongAnswers = await prisma.attempt.count({
      where: { userId, correct: false, skipped: false },
    });

    const activityLogs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
    });

    const streak = await prisma.streak.findUnique({ where: { userId } });

    return NextResponse.json({
      ...progress,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      activityLogs,
      streak: streak?.current || 0,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { levelId, questionIndex } = await request.json();

    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: { currentLevelId: levelId, currentQuestion: questionIndex, lastActivityAt: new Date() },
      create: { userId, currentLevelId: levelId, currentQuestion: questionIndex },
    });

    await prisma.activityLog.upsert({
      where: { userId_date: { userId, date: new Date().toISOString().split("T")[0] as any } },
      update: { timeSpent: { increment: 1 } },
      create: { userId, date: new Date().toISOString().split("T")[0] as any, timeSpent: 1 },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
