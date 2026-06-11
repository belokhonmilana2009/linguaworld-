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
import { LEVEL_LIST } from "@/lib/constants";
import { LevelId } from "@/types";
import { IoSearch, IoBook } from "react-icons/io5";

export default function GrammarPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchArticles();
  }, [isAuthenticated]);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/grammar");
      if (res.ok) setArticles(await res.json());
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.searchTags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = selectedLevel === "all" || a.levelId === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const groupedArticles = LEVEL_LIST.map((level) => ({
    level,
    articles: filteredArticles.filter((a) => a.levelId === level.id),
  })).filter((g) => g.articles.length > 0);

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
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-1">Грамматика</h1>
                    <p className="text-muted-foreground">
                      Правила английского языка простым языком
                    </p>
                  </div>

                  <div className="relative mb-6">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Поиск по грамматике..."
                      className="pl-10"
                    />
                  </div>

                  {/* Level filter */}
                  <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                    <button
                      onClick={() => setSelectedLevel("all")}
                      className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                        selectedLevel === "all"
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Все
                    </button>
                    {LEVEL_LIST.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                          selectedLevel === level.id
                            ? "bg-foreground text-background"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {level.flag} {level.id}
                      </button>
                    ))}
                  </div>

                  {groupedArticles.length > 0 ? (
                    <div className="space-y-8">
                      {groupedArticles.map(({ level, articles }) => (
                        <div key={level.id}>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">{level.flag}</span>
                            <h2 className="font-semibold">{level.id} — {level.city}</h2>
                          </div>
                          <div className="space-y-3">
                            {articles.map((article, i) => (
                              <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                              >
                                <Card
                                  className="p-4"
                                  onClick={() =>
                                    router.push(`/grammar/${article.id}`)
                                  }
                                >
                                  <h3 className="font-medium mb-2">{article.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {article.content?.replace(/<[^>]*>/g, "").slice(0, 150)}...
                                  </p>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<IoBook size={48} />}
                      title="Статьи не найдены"
                      description="Попробуйте изменить поисковый запрос или выберите другой уровень"
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
