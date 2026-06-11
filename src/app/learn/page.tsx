"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { LevelMap } from "@/components/learn/LevelMap";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVEL_LIST } from "@/lib/constants";
import { IoRocket, IoFlash, IoBook, IoTime } from "react-icons/io5";

export default function LearnPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { progress, loading, currentLevel, levelProgress } = useProgress();
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (progress) {
      const completed: string[] = [];
      const currentIdx = LEVEL_LIST.findIndex((l) => l.id === currentLevel);
      for (let i = 0; i < currentIdx; i++) {
        completed.push(LEVEL_LIST[i].id);
      }
      setCompletedLevels(completed);
    }
  }, [progress, currentLevel]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Navigation />
            <div className="flex-1 min-w-0">
              <AnimatedRoute>
                {/* Welcome & Stats */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1 className="text-3xl font-bold mb-2">
                      Ваше путешествие
                    </h1>
                    <p className="text-muted-foreground mb-6">
                      Продолжайте изучение английского. Уровень: {currentLevel}
                    </p>
                  </motion.div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                          <IoRocket className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{levelProgress.completed}</p>
                          <p className="text-xs text-muted-foreground">Ответов</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-xl">
                          <IoFlash className="text-success" size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progress?.streak || 0}</p>
                          <p className="text-xs text-muted-foreground">Дней подряд</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-info/10 rounded-xl">
                          <IoBook className="text-info" size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{currentLevel}</p>
                          <p className="text-xs text-muted-foreground">Текущий уровень</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning/10 rounded-xl">
                          <IoTime className="text-warning" size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {progress?.totalTime ? Math.floor(progress.totalTime / 60) : 0}м
                          </p>
                          <p className="text-xs text-muted-foreground">Время обучения</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Continue learning button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => router.push(`/learn/${currentLevel}`)}
                  >
                    Продолжить обучение ({currentLevel} — {LEVEL_LIST.find(l => l.id === currentLevel)?.city})
                  </Button>
                </motion.div>

                {/* Level Map */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Карта путешествия</h2>
                  <LevelMap
                    currentLevel={currentLevel}
                    completedLevels={completedLevels}
                  />
                </motion.div>
              </AnimatedRoute>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
