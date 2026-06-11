export type LevelId = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type QuestionType =
  | "text"
  | "voice"
  | "translation_ru_en"
  | "translation_en_ru"
  | "listening"
  | "image_description"
  | "image_task";

export type Strictness = "soft" | "medium" | "strict";

export interface LevelConfig {
  id: LevelId;
  name: string;
  city: string;
  description: string;
  order: number;
  strictness: Strictness;
  color: string;
  gradient: string;
  flag: string;
  coordinates: { lat: number; lng: number };
}

export interface Question {
  id: string;
  levelId: LevelId;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  hint: string;
  explanation: string;
  audioPrompt: string;
  gifPrompt: string;
  imagePrompt: string;
  order: number;
}

export interface UserProgress {
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  totalTime: number;
  currentLevel: LevelId;
  learnedWords: number;
}

export interface Certificate {
  id: string;
  levelId: LevelId;
  userName: string;
  date: Date;
  isGolden: boolean;
  certificateNumber: string;
}

export interface Achievement {
  id: string;
  levelId: LevelId;
  city: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GrammarArticle {
  id: string;
  levelId: LevelId;
  title: string;
  content: string;
  searchTags: string[];
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  example: string;
  levelId: LevelId;
  learnedAt: Date;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
  accuracy: number;
  mistakes: string[];
  correctAnswer: string;
  explanation: string;
  timestamp: Date;
}
