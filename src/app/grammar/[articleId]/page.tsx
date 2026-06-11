"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVELS } from "@/lib/constants";
import { LevelId } from "@/types";
import { IoArrowBack } from "react-icons/io5";

export default function GrammarArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && params.articleId) {
      fetchArticle();
    }
  }, [isAuthenticated, params.articleId]);

  const fetchArticle = async () => {
    try {
      const res = await fetch("/api/grammar");
      if (res.ok) {
        const articles = await res.json();
        const found = articles.find((a: any) => a.id === params.articleId);
        setArticle(found);
      }
    } catch (error) {
      console.error("Failed to load article:", error);
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

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Статья не найдена</p>
        </main>
      </div>
    );
  }

  const levelConfig = LEVELS[article.levelId as LevelId];

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
                  <Button variant="ghost" size="sm" onClick={() => router.push("/grammar")} className="mb-4">
                    <IoArrowBack size={16} className="mr-1" /> Назад к грамматике
                  </Button>

                  <Card hover={false}>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="info">{levelConfig?.flag} {article.levelId}</Badge>
                    </div>
                    <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: article.content || article.content,
                      }}
                    />
                  </Card>
                </div>
              </AnimatedRoute>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
