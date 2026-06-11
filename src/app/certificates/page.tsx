"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVELS } from "@/lib/constants";
import { LevelId } from "@/types";
import { IoDocument, IoDownload } from "react-icons/io5";

export default function CertificatesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchCertificates();
  }, [isAuthenticated]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error("Failed to load certificates:", error);
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
                    <h1 className="text-3xl font-bold mb-1">Мои сертификаты</h1>
                    <p className="text-muted-foreground">
                      {certificates.length} сертификатов получено
                    </p>
                  </div>

                  {certificates.length > 0 ? (
                    <div className="space-y-4">
                      {certificates.map((cert, i) => {
                        const level = LEVELS[cert.levelId as LevelId];
                        return (
                          <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Card className={`p-6 ${cert.isGolden ? "border-yellow-300 bg-yellow-50/30 dark:bg-yellow-900/10" : ""}`}>
                              <div className="flex items-center gap-6">
                                <div className="text-5xl">{level?.flag || "📜"}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">
                                      {cert.levelId} — {level?.city || "Unknown"}
                                    </h3>
                                    {cert.isGolden && <Badge variant="gold">Золотой</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {cert.userName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(cert.issuedAt).toLocaleDateString("ru-RU")} · №{cert.certificateNumber}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <IoDownload size={16} className="mr-1" /> PDF
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<IoDocument size={48} />}
                      title="Сертификаты пока не получены"
                      description="Завершайте уровни, чтобы получать сертификаты"
                      action={
                        <Button onClick={() => router.push("/learn")}>
                          Перейти к обучению
                        </Button>
                      }
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
