import { create } from "zustand";
import { LevelId, UserProgress, UserAnswer } from "@/types";

interface AppState {
  // Auth
  isGuest: boolean;
  setGuest: (val: boolean) => void;

  // Progress
  progress: UserProgress | null;
  setProgress: (progress: UserProgress) => void;

  // Current question state
  currentLevel: LevelId;
  setCurrentLevel: (level: LevelId) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;

  // Answers history
  lastAnswer: UserAnswer | null;
  setLastAnswer: (answer: UserAnswer | null) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  concentrationMode: boolean;
  setConcentrationMode: (mode: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isGuest: false,
  setGuest: (val) => set({ isGuest: val }),
  progress: null,
  setProgress: (progress) => set({ progress }),
  currentLevel: "A0",
  setCurrentLevel: (level) => set({ currentLevel: level }),
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  lastAnswer: null,
  setLastAnswer: (answer) => set({ lastAnswer: answer }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  concentrationMode: false,
  setConcentrationMode: (mode) => set({ concentrationMode: mode }),
}));
