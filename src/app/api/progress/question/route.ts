import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { levelId, questionId, answer, correct, accuracy } = await request.json();

    // Get the question to save correct answer
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Create attempt
    await prisma.attempt.create({
      data: {
        userId,
        questionId,
        userAnswer: answer,
        correct,
        accuracy,
        mistakes: correct ? [] : ["Ответ требует доработки"],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      },
    });

    // If wrong, add to errors
    if (!correct) {
      await prisma.userError.create({
        data: {
          userId,
          questionId,
          userAnswer: answer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        },
      });
    }

    // Update progress
    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        totalCompleted: { increment: 1 },
        correctAnswers: correct ? { increment: 1 } : undefined,
        wrongAnswers: !correct ? { increment: 1 } : undefined,
        lastActivityAt: new Date(),
      },
      create: { userId, totalCompleted: 1, correctAnswers: correct ? 1 : 0, wrongAnswers: !correct ? 1 : 0 },
    });

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (streak) {
      const lastDate = new Date(streak.lastDate);
      lastDate.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === yesterday.getTime()) {
        await prisma.streak.update({
          where: { userId },
          data: { current: { increment: 1 }, lastDate: today, longest: Math.max(streak.current + 1, streak.longest) },
        });
      } else if (lastDate.getTime() < yesterday.getTime()) {
        await prisma.streak.update({
          where: { userId },
          data: { current: 1, lastDate: today },
        });
      }
    } else {
      await prisma.streak.create({
        data: { userId, current: 1, longest: 1, lastDate: today },
      });
    }

    // Save new words to dictionary
    const wordMatches: string[] = (answer.match(/\b[a-zA-Z]{3,}\b/g) || []) as string[];
    const uniqueWords: string[] = [...new Set(wordMatches.map((w: string) => w.toLowerCase()))];
    for (const word of uniqueWords) {
      const existing = await prisma.word.findUnique({
        where: { userId_word: { userId, word } },
      });
      if (!existing) {
        await prisma.word.create({
          data: {
            userId,
            word,
            translation: "",
            example: question.question,
            levelId: levelId || "A0",
          },
        });
      }
    }

    // Update activity log
    const todayStr = today.toISOString().split("T")[0];
    await prisma.activityLog.upsert({
      where: { userId_date: { userId, date: todayStr as any } },
      update: { questions: { increment: 1 }, correct: correct ? { increment: 1 } : undefined, wrong: !correct ? { increment: 1 } : undefined },
      create: { userId, date: todayStr as any, questions: 1, correct: correct ? 1 : 0, wrong: !correct ? 1 : 0 },
    });

    // Check level completion
    const levelQuestions = await prisma.question.count({ where: { levelId: levelId || "A0" } });
    const levelAttempts = await prisma.attempt.count({
      where: {
        userId,
        question: { levelId: levelId || "A0" },
      },
    });

    let levelCompleted = false;
    if (levelQuestions > 0 && levelAttempts >= levelQuestions) {
      levelCompleted = true;
      // Generate certificate
      const certNumber = `LW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await prisma.certificate.create({
        data: {
          userId,
          levelId: levelId || "A0",
          userName: session.user.name || "Student",
          isGolden: correct, // golden if last answer was correct
          certificateNumber: certNumber,
        },
      });
      // Unlock achievement
      const level = await prisma.level.findUnique({ where: { levelId: levelId || "A0" } });
      if (level) {
        await prisma.achievement.create({
          data: {
            userId,
            levelId: level.id,
            city: level.city,
            unlocked: true,
            unlockedAt: new Date(),
          },
        });
      }
    }

    const totalQuestions = await prisma.question.count();
    const correctAnswers = await prisma.attempt.count({ where: { userId, correct: true } });
    const wrongAnswers = await prisma.attempt.count({ where: { userId, correct: false, skipped: false } });

    return NextResponse.json({
      ...progress,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      levelCompleted,
    });
  } catch (error) {
    console.error("Error recording answer:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
