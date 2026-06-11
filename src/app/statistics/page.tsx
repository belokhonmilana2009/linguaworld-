"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVEL_LIST } from "@/lib/constants";
import { IoCheckmarkCircle, IoCloseCircle, IoTime, IoFlame, IoBook, IoDocument, IoBarChart } from "react-icons/io5";

export default function StatisticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/statistics");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const completionRate = data?.completionRate || 0;
  const activityLogs = data?.activityLogs || [];
  const calendarDays = activityLogs.slice(0, 365);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Navigation />
            <div className="flex-1 min-w-0">
              <AnimatedRoute>
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Статистика</h1>
                    <p className="text-muted-foreground">Ваш прогресс и достижения</p>
                  </div>

                  {/* Main Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <IoCheckmarkCircle className="text-success mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold">{data?.correctAttempts || 0}</p>
                      <p className="text-xs text-muted-foreground">Правильных</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <IoCloseCircle className="text-destructive mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold">{data?.wrongAttempts || 0}</p>
                      <p className="text-xs text-muted-foreground">Ошибок</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <IoTime className="text-info mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold">
                        {data?.progress?.totalTime ? Math.floor(data.progress.totalTime / 60) : 0}м
                      </p>
                      <p className="text-xs text-muted-foreground">Время</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <IoFlame className="text-warning mx-auto mb-2" size={24} />
                      <p className="text-2xl font-bold">{data?.streak?.longest || 0}</p>
                      <p className="text-xs text-muted-foreground">Лучшая серия</p>
                    </Card>
                  </div>

                  {/* Completion Rate */}
                  <Card>
                    <h2 className="font-semibold mb-4">Общий прогресс</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-4xl font-bold">{completionRate}%</span>
                      <span className="text-sm text-muted-foreground">
                        {data?.correctAttempts || 0} / {data?.totalAttempts || 0} ответов
                      </span>
                    </div>
                    <ProgressBar value={completionRate} max={100} size="lg" showLabel />
                  </Card>

                  {/* Level Progress */}
                  <Card>
                    <h2 className="font-semibold mb-4">Прогресс по уровням</h2>
                    <div className="space-y-4">
                      {LEVEL_LIST.map((level) => {
                        const levelQuestions = data?.totalQuestions || 700;
                        const questionsPerLevel = Math.floor(levelQuestions / 7);
                        const completed = Math.min(
                          (data?.correctAttempts || 0) - (LEVEL_LIST.indexOf(level) * questionsPerLevel),
                          questionsPerLevel
                        );
                        const progress = Math.max(0, Math.min(100, Math.round((completed / questionsPerLevel) * 100)));

                        return (
                          <div key={level.id} className="flex items-center gap-4">
                            <span className="text-lg w-8">{level.flag}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{level.id}</span>
                                <span className="text-muted-foreground">{progress}%</span>
                              </div>
                              <ProgressBar value={progress} max={100} size="sm" color={level.color} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Activity Calendar */}
                  <Card>
                    <h2 className="font-semibold mb-4">Активность</h2>
                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarDays.slice(0, 28).map((day: any, i: number) => {
                        const intensity = Math.min(day.questions || 0, 20);
                        const opacity = Math.max(0.1, intensity / 20);
                        return (
                          <div
                            key={i}
                            className="aspect-square rounded-md bg-foreground transition-all"
                            style={{ opacity }}
                            title={`${day.questions} вопросов`}
                          />
                        );
                      })}
                    </div>
                    {calendarDays.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Пока нет данных об активности
                      </p>
                    )}
                  </Card>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <IoBook className="mx-auto mb-2 text-muted-foreground" size={20} />
                      <p className="text-xl font-bold">{data?.words || 0}</p>
                      <p className="text-xs text-muted-foreground">Изученных слов</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <IoDocument className="mx-auto mb-2 text-muted-foreground" size={20} />
                      <p className="text-xl font-bold">{data?.certificates || 0}</p>
                      <p className="text-xs text-muted-foreground">Сертификатов</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <IoBarChart className="mx-auto mb-2 text-muted-foreground" size={20} />
                      <p className="text-xl font-bold">{data?.achievements || 0}</p>
                      <p className="text-xs text-muted-foreground">Достижений</p>
                    </Card>
                  </div>
                </div>
              </AnimatedRoute>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
