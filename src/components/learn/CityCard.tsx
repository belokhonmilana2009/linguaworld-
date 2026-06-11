"use client";

import { motion } from "framer-motion";
import { LevelConfig } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface CityCardProps {
  level: LevelConfig;
  progress: { completed: number; total: number; percentage: number };
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick?: () => void;
}

export function CityCard({
  level,
  progress,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: CityCardProps) {
  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : undefined}
      whileTap={!isLocked && onClick ? { scale: 0.98 } : undefined}
      onClick={isLocked ? undefined : onClick}
      className={`relative rounded-2xl border p-6 cursor-default transition-all ${
        isActive
          ? "border-foreground shadow-lg"
          : isCompleted
          ? "border-success/30"
          : isLocked
          ? "border-border opacity-40"
          : "border-border hover:border-foreground/30"
      } ${!isLocked ? "cursor-pointer" : ""}`}
    >
      {/* City image placeholder */}
      <div
        className={`w-full aspect-[16/9] rounded-xl mb-4 bg-gradient-to-br ${level.gradient} flex items-center justify-center`}
      >
        <span className="text-5xl">{level.flag}</span>
      </div>

      {/* Level badge */}
      <Badge
        variant={isCompleted ? "success" : isActive ? "info" : "default"}
        size="sm"
        className="mb-2"
      >
        {isCompleted ? "Пройдено" : isActive ? "В процессе" : level.id}
      </Badge>

      <h3 className="font-semibold text-lg mb-1">{level.city}</h3>
      <p className="text-sm text-muted-foreground mb-4">{level.name}</p>

      {!isLocked && (
        <ProgressBar
          value={progress.completed}
          max={progress.total}
          size="sm"
          color={level.color}
        />
      )}
    </motion.div>
  );
}
