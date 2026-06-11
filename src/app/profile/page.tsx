"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { AnimatedRoute } from "@/components/animation/AnimatedRoute";
import { LEVELS, LEVEL_LIST } from "@/lib/constants";
import { LevelId } from "@/types";
import { IoCamera, IoTime, IoFlame, IoBook, IoCheckmarkCircle, IoDocument } from "react-icons/io5";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setData(data);
        setEditName(data.profile?.name || data.name || "");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        toast.success("Профиль обновлён");
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error("Ошибка сохранения");
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

  const currentLevel = data?.progress?.currentLevelId || "A0";
  const levelConfig = LEVELS[currentLevel as LevelId];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Navigation />
            <div className="flex-1 min-w-0">
              <AnimatedRoute>
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Profile Header */}
                  <Card className="text-center p-8">
                    <div className="relative inline-block mb-4">
                      <Avatar src={user?.image || data?.profile?.avatarUrl} name={editName || user?.name} size="xl" />
                      <button className="absolute bottom-0 right-0 p-1.5 bg-foreground text-background rounded-full">
                        <IoCamera size={14} />
                      </button>
                    </div>
                    {editing ? (
                      <div className="max-w-xs mx-auto space-y-3">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Имя" />
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" onClick={handleSave}>Сохранить</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Отмена</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-2xl font-bold mb-1">{data?.profile?.name || user?.name || "Пользователь"}</h1>
                        <p className="text-muted-foreground mb-3">{data?.email}</p>
                        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Редактировать</Button>
                      </div>
                    )}
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold">{data?.progress?.totalCompleted || 0}</p>
                      <p className="text-sm text-muted-foreground">Всего ответов</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-success">{data?.progress?.correctAnswers || 0}</p>
                      <p className="text-sm text-muted-foreground">Правильных</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-destructive">{data?.progress?.wrongAnswers || 0}</p>
                      <p className="text-sm text-muted-foreground">Ошибок</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold">
                        {data?.streak?.current || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Дней подряд</p>
                    </Card>
                  </div>

                  {/* Current Level */}
                  <Card>
                    <h2 className="font-semibold mb-4">Текущий уровень</h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{levelConfig?.flag}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{currentLevel} — {levelConfig?.city}</h3>
                        <p className="text-sm text-muted-foreground">{levelConfig?.description}</p>
                      </div>
                    </div>
                    <ProgressBar
                      value={data?.progress?.totalCompleted || 0}
                      max={LEVEL_LIST.length * 100}
                      size="md"
                      showLabel
                      color={levelConfig?.color}
                    />
                  </Card>

                  {/* Certificates */}
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold">Сертификаты</h2>
                      <Badge variant="gold">{data?.certificates?.length || 0}</Badge>
                    </div>
                    {data?.certificates?.length > 0 ? (
                      <div className="space-y-3">
                        {data.certificates.slice(0, 3).map((cert: any) => (
                          <div key={cert.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                            <IoDocument className="text-muted-foreground" size={20} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{cert.levelId}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(cert.issuedAt).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                            {cert.isGolden && <Badge variant="gold">Золотой</Badge>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Сертификаты пока не получены</p>
                    )}
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
