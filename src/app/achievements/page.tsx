"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVEL_LIST } from "@/lib/constants";
import { IoLockClosed, IoCheckmarkCircle, IoTrophy } from "react-icons/io5";

export default function AchievementsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchAchievements();
  }, [isAuthenticated]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error("Failed to load achievements:", error);
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

  const unlockedIds = new Set(achievements.map((a: any) => a.levelId));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Navigation />
            <div className="flex-1 min-w-0">
              <AnimatedRoute>
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-1">Достижения</h1>
                    <p className="text-muted-foreground">
                      {achievements.length} из {LEVEL_LIST.length} получено
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LEVEL_LIST.map((level, i) => {
                      const unlocked = unlockedIds.has(level.id);
                      return (
                        <motion.div
                          key={level.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card
                            className={`p-6 text-center ${
                              unlocked ? "" : "opacity-50"
                            }`}
                            hover={false}
                          >
                            <div className="relative mb-4">
                              <span className="text-6xl block mb-2">
                                {unlocked ? level.flag : "🔒"}
                              </span>
                              {unlocked && (
                                <div className="absolute -top-1 -right-1">
                                  <IoCheckmarkCircle className="text-success" size={24} />
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold mb-1">{level.city}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {level.id} — {level.name}
                            </p>
                            {unlocked ? (
                              <Badge variant="success">Получено</Badge>
                            ) : (
                              <Badge variant="default">Не получено</Badge>
                            )}
                          </Card>
                        </motion.div>
                      );
                    })}
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
