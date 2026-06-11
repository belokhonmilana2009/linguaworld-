"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, LevelConfig, UserAnswer } from "@/types";
import { TextAnswer } from "./TextAnswer";
import { VoiceAnswer } from "./VoiceAnswer";
import { ImageQuestion } from "./ImageQuestion";
import { AudioQuestion } from "./AudioQuestion";
import { TranslationQuestion } from "./TranslationQuestion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { speakText } from "@/lib/speech";
import { IoChevronBack, IoHelpCircle, IoClose, IoVolumeHigh, IoFlag } from "react-icons/io5";
import toast from "react-hot-toast";

interface QuestionCardProps {
  question: Question;
  level: LevelConfig;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => Promise<UserAnswer>;
  onSkip: () => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  level,
  questionIndex,
  totalQuestions,
  onAnswer,
  onSkip,
  onNext,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState<UserAnswer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setAnswer(null);
    setShowHint(false);
  }, [question.id]);

  const handleSubmit = async (userAnswer: string) => {
    if (!userAnswer.trim() || submitting) return;
    setSubmitting(true);
    try {
      const result = await onAnswer(userAnswer);
      setAnswer(result);
    } catch (error) {
      toast.error("Ошибка при проверке ответа");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    speakText(question.question, 0.9);
    onSkip();
  };

  const typeLabels: Record<string, string> = {
    text: "Текстовый ответ",
    voice: "Голосовой ответ",
    translation_ru_en: "Перевод RU -> EN",
    translation_en_ru: "Перевод EN -> RU",
    listening: "Аудирование",
    image_description: "Описание изображения",
    image_task: "Задание по картинке",
  };

  const typeIcons: Record<string, string> = {
    text: ":pencil:",
    voice: ":microphone:",
    translation_ru_en: ":arrows_counterclockwise:",
    translation_en_ru: ":arrows_counterclockwise:",
    listening: ":headphone:",
    image_description: ":framed_picture:",
    image_task: ":artist_palette:",
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="info" size="md">
            {typeIcons[question.type]} {typeLabels[question.type] || "Задание"}
          </Badge>
          <Badge variant="default" size="sm">
            {level.flag} {level.id}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Подсказка"
          >
            <IoHelpCircle size={20} />
          </button>
          <button
            onClick={handleSkip}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Пропустить"
          >
            <IoFlag size={18} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Вопрос {questionIndex + 1} из {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((questionIndex) / totalQuestions) * 100)}%
          </span>
        </div>
        <ProgressBar value={questionIndex} max={totalQuestions} size="sm" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Audio button for listening questions */}
          {question.type === "listening" && (
            <div className="flex justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speakText(question.question, 0.85)}
                className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg"
              >
                <IoVolumeHigh size={32} />
              </motion.button>
            </div>
          )}

          {/* Question text */}
          <h2 className="text-2xl font-semibold mb-6 text-center leading-relaxed">
            {question.question}
          </h2>

          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-secondary/50 rounded-2xl p-4 mb-6 overflow-hidden"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Подсказка:</span> {question.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer component based on type */}
          <div className="mb-6">
            {question.type === "voice" ? (
              <VoiceAnswer
                question={question}
                onSubmit={handleSubmit}
                disabled={!!answer || submitting}
              />
            ) : question.type === "listening" ? (
              <AudioQuestion
                question={question}
                onSubmit={handleSubmit}
                disabled={!!answer || submitting}
              />
            ) : question.type === "image_description" || question.type === "image_task" ? (
              <ImageQuestion
                question={question}
                onSubmit={handleSubmit}
                disabled={!!answer || submitting}
              />
            ) : question.type === "translation_ru_en" || question.type === "translation_en_ru" ? (
              <TranslationQuestion
                question={question}
                onSubmit={handleSubmit}
                disabled={!!answer || submitting}
              />
            ) : (
              <TextAnswer
                question={question}
                onSubmit={handleSubmit}
                disabled={!!answer || submitting}
              />
            )}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 mb-6 ${
                  answer.correct
                    ? "bg-success/10 border border-success/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    {answer.correct ? "Правильно!" : "Неправильно"}
                  </h3>
                  <span className="text-sm font-medium">
                    Точность: {answer.accuracy}%
                  </span>
                </div>

                {!answer.correct && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Правильный ответ:</p>
                      <p className="font-medium text-lg">{answer.correctAnswer}</p>
                    </div>
                    {answer.mistakes.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Ошибки:</p>
                        <ul className="space-y-1 mt-1">
                          {answer.mistakes.map((m, i) => (
                            <li key={i} className="text-sm text-destructive">
                              • {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                  </div>
                )}

                {answer.correct && (
                  <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            {!answer ? (
              <Button variant="ghost" size="md" onClick={handleSkip}>
                Пропустить вопрос
              </Button>
            ) : answer.correct ? (
              <Button size="lg" onClick={onNext}>
                {questionIndex < totalQuestions - 1 ? "Следующий вопрос →" : "Завершить уровень"}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Ответьте правильно, чтобы продолжить
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
