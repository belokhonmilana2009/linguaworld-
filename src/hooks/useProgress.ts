"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LevelId, UserProgress } from "@/types";
import { LEVELS } from "@/lib/constants";
import { useAuth } from "./useAuth";

export function useProgress() {
  const { user, isAuthenticated } = useAuth();
  const { progress, setProgress, currentLevel, setCurrentLevel } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (levelId: LevelId, questionIndex: number) => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId, questionIndex }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const completeQuestion = async (
    levelId: LevelId,
    questionId: string,
    answer: string,
    correct: boolean,
    accuracy: number
  ) => {
    try {
      const res = await fetch("/api/progress/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId, questionId, answer, correct, accuracy }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to record answer:", error);
    }
  };

  const levelProgress = progress
    ? {
        completed: progress.completedQuestions,
        total: progress.totalQuestions,
        percentage: progress.totalQuestions > 0
          ? Math.round((progress.completedQuestions / progress.totalQuestions) * 100)
          : 0,
      }
    : { completed: 0, total: 0, percentage: 0 };

  return {
    progress,
    loading,
    currentLevel: progress?.currentLevel as LevelId || currentLevel,
    levelProgress,
    updateProgress,
    completeQuestion,
    refresh: fetchProgress,
    setCurrentLevel,
  };
}
