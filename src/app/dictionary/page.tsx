"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVELS, LEVEL_LIST } from "@/lib/constants";
import { IoSearch, IoBook } from "react-icons/io5";

export default function DictionaryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchWords();
  }, [isAuthenticated]);

  const fetchWords = async () => {
    try {
      const res = await fetch("/api/dictionary");
      if (res.ok) setWords(await res.json());
    } catch (error) {
      console.error("Failed to load words:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase())
  );

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
                      <h1 className="text-3xl font-bold mb-1">Мой словарь</h1>
                      <p className="text-muted-foreground">
                        {words.length} изученных слов
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Поиск слов..."
                      className="pl-10"
                    />
                  </div>

                  {filteredWords.length > 0 ? (
                    <div className="space-y-2">
                      {filteredWords.map((word, i) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Card hover={false} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{word.word}</h3>
                                {word.translation && (
                                  <p className="text-muted-foreground">{word.translation}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge variant="default" size="sm">
                                  {word.levelId || "A0"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(word.learnedAt).toLocaleDateString("ru-RU")}
                                </p>
                              </div>
                            </div>
                            {word.example && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                {word.example}
                              </p>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : words.length === 0 ? (
                    <EmptyState
                      icon={<IoBook size={48} />}
                      title="Словарь пуст"
                      description="Новые слова будут автоматически добавляться по мере выполнения заданий"
                    />
                  ) : (
                    <EmptyState
                      icon={<IoSearch size={48} />}
                      title="Ничего не найдено"
                      description="Попробуйте изменить поисковый запрос"
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
