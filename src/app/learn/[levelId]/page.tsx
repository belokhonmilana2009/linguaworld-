"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { QuestionCard } from "@/components/learn/QuestionCard";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LEVELS, LEVEL_LIST, QUESTIONS_PER_LEVEL, STRICTNESS_THRESHOLDS } from "@/lib/constants";
import { Question, LevelId, LevelConfig, UserAnswer } from "@/types";
import { IoCheckmarkCircle, IoRocket } from "react-icons/io5";
import toast from "react-hot-toast";

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.levelId as LevelId;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { progress, loading: progressLoading, completeQuestion, refresh } = useProgress();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const level = LEVELS[levelId];
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (levelId && isAuthenticated) {
      fetchQuestions();
    }
  }, [levelId, isAuthenticated]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?levelId=${levelId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);

        // Find where user left off
        const answeredIds = data.questions
          .filter((q: any) => q.answered)
          .map((q: any) => q.id);

        // Check if all questions are answered (level complete)
        if (answeredIds.length >= QUESTIONS_PER_LEVEL) {
          setLevelCompleted(true);
          return;
        }

        // Find first unanswered question
        const firstUnanswered = data.questions.findIndex((q: any) => !q.answered);
        if (firstUnanswered >= 0) {
          setCurrentIndex(firstUnanswered);
        }
      }
    } catch (error) {
      toast.error("Ошибка загрузки вопросов");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback(async (answer: string): Promise<UserAnswer> => {
    if (!currentQuestion) {
      return { correct: false, accuracy: 0, mistakes: ["Ошибка"], correctAnswer: "", explanation: "", questionId: "", userAnswer: answer, timestamp: new Date() };
    }

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: answer,
          levelId,
        }),
      });

      if (!res.ok) throw new Error("Check failed");

      const result = await res.json();

      // Record the attempt
      await completeQuestion(levelId, currentQuestion.id, answer, result.correct, result.accuracy);

      return {
        questionId: currentQuestion.id,
        userAnswer: answer,
        correct: result.correct,
        accuracy: result.accuracy,
        mistakes: result.mistakes || [],
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
        timestamp: new Date(),
      };
    } catch (error) {
      toast.error("Ошибка проверки ответа");
      throw error;
    }
  }, [currentQuestion, levelId, completeQuestion]);

  const handleSkip = useCallback(async () => {
    if (!currentQuestion) return;

    try {
      await fetch("/api/progress/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId,
          questionId: currentQuestion.id,
          answer: "",
          correct: false,
          accuracy: 0,
        }),
      });

      // Move to next question
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Check completion
        checkLevelCompletion();
      }
    } catch (error) {
      toast.error("Ошибка при пропуске");
    }
  }, [currentQuestion, currentIndex, questions.length, levelId]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      checkLevelCompletion();
    }
  }, [currentIndex, questions.length]);

  const checkLevelCompletion = async () => {
    try {
      const res = await fetch(`/api/questions?levelId=${levelId}`);
      if (res.ok) {
        const data = await res.json();
        const answeredCount = data.questions.filter((q: any) => q.answered).length;
        if (answeredCount >= QUESTIONS_PER_LEVEL) {
          setLevelCompleted(true);
          setShowCertificate(true);
          toast.success("Уровень пройден! 🎉");
          refresh();
        } else {
          // Some questions were just skipped, just reload
          fetchQuestions();
        }
      }
    } catch (error) {
      toast.error("Ошибка проверки завершения уровня");
    }
  };

  if (authLoading || progressLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex gap-8">
              <Navigation />
              <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !level) return null;

  if (levelCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex gap-8">
              <Navigation />
              <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IoCheckmarkCircle size={48} className="text-success" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Уровень пройден!</h1>
                  <p className="text-muted-foreground mb-6">
                    {level.flag} {level.city} — {level.name}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button onClick={() => router.push(`/learn`)}>
                      Вернуться к карте
                    </Button>
                    {level.order < LEVEL_LIST.length - 1 && (
                      <Button
                        variant="primary"
                        onClick={() => router.push(`/learn/${LEVEL_LIST[level.order + 1].id}`)}
                      >
                        Следующий уровень
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Modal
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          title="Поздравляем с завершением уровня!"
          size="md"
        >
          <div className="text-center py-4">
            <div className="text-6xl mb-4">{level.flag}</div>
            <h3 className="text-xl font-bold mb-2">{level.city}</h3>
            <p className="text-muted-foreground mb-6">
              Вы успешно завершили уровень {level.id} — {level.name}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Сертификат доступен в вашем профиле
            </p>
            <Button onClick={() => setShowCertificate(false)}>
              Продолжить
            </Button>
          </div>
        </Modal>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex gap-8">
              <Navigation />
              <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">Вопросы не найдены</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Navigation />
            <div className="flex-1 min-w-0">
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                level={level}
                questionIndex={currentIndex}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
                onNext={handleNext}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
