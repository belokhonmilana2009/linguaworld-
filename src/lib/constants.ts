import { LevelConfig, LevelId } from "@/types";

export const APP_NAME = "LinguaWorld";
export const APP_DESCRIPTION =
  "Премиальная платформа для изучения английского языка. Проходи путь от A0 до C2 через интерактивные задания, голосовые ответы и ИИ-проверку.";

export const LEVELS: Record<LevelId, LevelConfig> = {
  A0: {
    id: "A0",
    name: "Starter",
    city: "London",
    description: "С нуля до первых слов",
    order: 0,
    strictness: "soft",
    color: "#FF6B6B",
    gradient: "from-[#FF6B6B] to-[#FF8E53]",
    flag: "🇬🇧",
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  A1: {
    id: "A1",
    name: "Beginner",
    city: "New York",
    description: "Первые шаги в английском",
    order: 1,
    strictness: "soft",
    color: "#4ECDC4",
    gradient: "from-[#4ECDC4] to-[#44B09E]",
    flag: "🇺🇸",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  A2: {
    id: "A2",
    name: "Elementary",
    city: "Toronto",
    description: "Базовые знания и уверенность",
    order: 2,
    strictness: "soft",
    color: "#45B7D1",
    gradient: "from-[#45B7D1] to-[#2980B9]",
    flag: "🇨🇦",
    coordinates: { lat: 43.6532, lng: -79.3832 },
  },
  B1: {
    id: "B1",
    name: "Intermediate",
    city: "Sydney",
    description: "Средний уровень и общение",
    order: 3,
    strictness: "medium",
    color: "#F9CA24",
    gradient: "from-[#F9CA24] to-[#F0932B]",
    flag: "🇦🇺",
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  B2: {
    id: "B2",
    name: "Upper Intermediate",
    city: "Singapore",
    description: "Продвинутый средний",
    order: 4,
    strictness: "medium",
    color: "#A29BFE",
    gradient: "from-[#A29BFE] to-[#6C5CE7]",
    flag: "🇸🇬",
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  C1: {
    id: "C1",
    name: "Advanced",
    city: "Dublin",
    description: "Свободное владение",
    order: 5,
    strictness: "strict",
    color: "#FD79A8",
    gradient: "from-[#FD79A8] to-[#E84393]",
    flag: "🇮🇪",
    coordinates: { lat: 53.3498, lng: -6.2603 },
  },
  C2: {
    id: "C2",
    name: "Proficiency",
    city: "World English Master",
    description: "Уровень носителя языка",
    order: 6,
    strictness: "strict",
    color: "#FFD700",
    gradient: "from-[#FFD700] to-[#FFA500]",
    flag: "🌍",
    coordinates: { lat: 0, lng: 0 },
  },
};

export const LEVEL_LIST: LevelConfig[] = Object.values(LEVELS).sort(
  (a, b) => a.order - b.order
);

export const QUESTIONS_PER_LEVEL = 100;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LEARN: "/learn",
  PROFILE: "/profile",
  STATISTICS: "/statistics",
  DICTIONARY: "/dictionary",
  ERRORS: "/errors",
  GRAMMAR: "/grammar",
  CONCENTRATION: "/concentration",
  ACHIEVEMENTS: "/achievements",
  CERTIFICATES: "/certificates",
} as const;

export const STRICTNESS_THRESHOLDS = {
  soft: { minAccuracy: 30, caseSensitive: false, ignorePunctuation: true, ignoreArticles: true },
  medium: { minAccuracy: 60, caseSensitive: false, ignorePunctuation: true, ignoreArticles: false },
  strict: { minAccuracy: 85, caseSensitive: true, ignorePunctuation: false, ignoreArticles: false },
} as const;
