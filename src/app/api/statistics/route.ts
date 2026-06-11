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

    const [
      progress,
      streak,
      statistics,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
      skippedAttempts,
      certificates,
      achievements,
      words,
      errors,
      activityLogs,
    ] = await Promise.all([
      prisma.userProgress.findUnique({ where: { userId } }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.statistics.findUnique({ where: { userId } }),
      prisma.attempt.count({ where: { userId } }),
      prisma.attempt.count({ where: { userId, correct: true } }),
      prisma.attempt.count({ where: { userId, correct: false, skipped: false } }),
      prisma.attempt.count({ where: { userId, skipped: true } }),
      prisma.certificate.count({ where: { userId } }),
      prisma.achievement.count({ where: { userId, unlocked: true } }),
      prisma.word.count({ where: { userId } }),
      prisma.userError.count({ where: { userId, resolved: false } }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 365,
      }),
    ]);

    const totalQuestions = await prisma.question.count();

    return NextResponse.json({
      progress,
      streak,
      statistics,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
      skippedAttempts,
      certificates,
      achievements,
      words,
      errors,
      activityLogs,
      totalQuestions,
      completionRate: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
    });
  } catch (error) {
    console.error("GET /api/statistics error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
