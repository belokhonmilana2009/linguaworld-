"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { IoCloseCircle, IoRefresh } from "react-icons/io5";
import toast from "react-hot-toast";

export default function ErrorsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchErrors();
  }, [isAuthenticated]);

  const fetchErrors = async () => {
    try {
      const res = await fetch("/api/errors");
      if (res.ok) setErrors(await res.json());
    } catch (error) {
      console.error("Failed to load errors:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolveError = async (errorId: string) => {
    try {
      const res = await fetch("/api/errors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorId }),
      });
      if (res.ok) {
        setErrors(errors.filter((e) => e.id !== errorId));
        toast.success("Ошибка отмечена как исправленная");
      }
    } catch (error) {
      toast.error("Ошибка");
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
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">Мои ошибки</h1>
                      <p className="text-muted-foreground">
                        {errors.length} неисправленных ошибок
                      </p>
                    </div>
                  </div>

                  {errors.length > 0 ? (
                    <div className="space-y-4">
                      {errors.map((error, i) => (
                        <motion.div
                          key={error.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className="p-5 border-destructive/20">
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="danger">Ошибка</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => resolveError(error.id)}
                              >
                                <IoRefresh size={16} className="mr-1" /> Исправлено
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">Ваш ответ:</p>
                            <p className="font-medium text-destructive mb-3">
                              {error.userAnswer}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">Правильный ответ:</p>
                            <p className="font-medium text-success mb-3">
                              {error.correctAnswer}
                            </p>
                            <p className="text-sm text-muted-foreground/70">
                              {error.explanation}
                            </p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<IoCloseCircle size={48} />}
                      title="Нет ошибок"
                      description="Отлично! У вас нет неисправленных ошибок."
                    />
                  )}
                </div>
              </AnimatedRoute>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
