"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TextAnswer } from "@/components/learn/TextAnswer";
import { VoiceAnswer } from "@/components/learn/VoiceAnswer";
import { ImageQuestion } from "@/components/learn/ImageQuestion";
import { AudioQuestion } from "@/components/learn/AudioQuestion";
import { TranslationQuestion } from "@/components/learn/TranslationQuestion";
import { Question, UserAnswer } from "@/types";
import { IoClose, IoVolumeHigh } from "react-icons/io5";
import { speakText } from "@/lib/speech";
import toast from "react-hot-toast";

export default function ConcentrationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
      enterFullscreen();
    }
    return () => exitFullscreen();
  }, [isAuthenticated]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions.slice(0, 20));
      }
    } catch (error) {
      toast.error("Ошибка загрузки вопросов");
    } finally {
      setLoading(false);
    }
  };

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {}
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const handleExit = () => {
    exitFullscreen();
    router.push("/learn");
  };

  const handleAnswer = useCallback(async (answer: string): Promise<UserAnswer> => {
    const question = questions[currentIndex];
    if (!question) throw new Error("No question");

    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, userAnswer: answer, levelId: question.levelId }),
    });

    if (!res.ok) throw new Error("Check failed");
    const result = await res.json();

    if (result.correct && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (result.correct) {
      toast.success("Уровень концентрации завершён!");
      handleExit();
    }

    return {
      questionId: question.id,
      userAnswer: answer,
      correct: result.correct,
      accuracy: result.accuracy,
      mistakes: result.mistakes || [],
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      timestamp: new Date(),
    };
  }, [questions, currentIndex]);

  const renderQuestionInput = () => {
    const question = questions[currentIndex];
    if (!question) return null;

    if (question.type === "voice") {
      return <VoiceAnswer question={question} onSubmit={() => {}} disabled={false} />;
    }
    if (question.type === "listening") {
      return <AudioQuestion question={question} onSubmit={() => {}} disabled={false} />;
    }
    if (question.type === "image_description" || question.type === "image_task") {
      return <ImageQuestion question={question} onSubmit={() => {}} disabled={false} />;
    }
    if (question.type === "translation_ru_en" || question.type === "translation_en_ru") {
      return <TranslationQuestion question={question} onSubmit={() => {}} disabled={false} />;
    }
    return <TextAnswer question={question} onSubmit={() => {}} disabled={false} />;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Minimal header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleExit}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <IoClose size={24} />
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
          {currentQuestion && (
            <button
              onClick={() => speakText(currentQuestion.question, 0.9)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <IoVolumeHigh size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-8">
        <ProgressBar value={currentIndex} max={questions.length} size="sm" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 max-w-2xl mx-auto w-full">
        {currentQuestion ? (
          <div className="w-full text-center">
            <h2 className="text-2xl font-semibold mb-8">{currentQuestion.question}</h2>
            {renderQuestionInput()}
          </div>
        ) : (
          <p className="text-muted-foreground">Нет вопросов</p>
        )}
      </div>
    </div>
  );
}
