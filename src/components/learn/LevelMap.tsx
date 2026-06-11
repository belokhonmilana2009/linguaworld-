"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LEVEL_LIST } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IoLockClosed, IoCheckmarkCircle } from "react-icons/io5";

interface LevelMapProps {
  currentLevel: string;
  completedLevels: string[];
}

export function LevelMap({ currentLevel, completedLevels }: LevelMapProps) {
  const currentIndex = LEVEL_LIST.findIndex((l) => l.id === currentLevel);

  return (
    <div className="space-y-4">
      {LEVEL_LIST.map((level, index) => {
        const isCompleted = completedLevels.includes(level.id);
        const isCurrent = level.id === currentLevel;
        const isLocked = index > currentIndex + 1;

        return (
          <Link
            key={level.id}
            href={isLocked ? "#" : `/learn/${level.id}`}
            className={`block`}
          >
            <motion.div
              whileHover={!isLocked ? { x: 4 } : undefined}
              className={`relative p-5 rounded-2xl border transition-all ${
                isCurrent
                  ? "border-foreground bg-card shadow-lg"
                  : isCompleted
                  ? "border-success/30 bg-success/5"
                  : isLocked
                  ? "border-border bg-card/50 opacity-50"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Level icon */}
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCurrent
                        ? "bg-foreground text-background"
                        : isCompleted
                        ? "bg-success/20"
                        : "bg-secondary"
                    }`}
                  >
                    {isLocked ? (
                      <IoLockClosed size={20} className="text-muted-foreground" />
                    ) : isCompleted ? (
                      <IoCheckmarkCircle size={24} className="text-success" />
                    ) : (
                      level.flag
                    )}
                  </div>
                  {/* Connection line */}
                  {index < LEVEL_LIST.length - 1 && (
                    <div className="absolute left-1/2 -bottom-6 w-0.5 h-5 bg-border -translate-x-1/2" />
                  )}
                </div>

                {/* Level info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">
                      {level.id} — {level.city}
                    </h3>
                    {isCompleted && (
                      <Badge variant="success" size="sm">
                        Пройдено
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge variant="info" size="sm">
                        Текущий
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>

                {/* Level order number */}
                <div className="text-3xl font-bold text-muted-foreground/20">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
