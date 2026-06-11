"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IoLogoGoogle, IoPaperPlane, IoPerson, IoLanguage } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/learn" });
    setLoading(null);
  };

  const handleGuestLogin = async () => {
    setLoading("guest");
    await signIn("guest", { name: guestName || "Гость", callbackUrl: "/learn" });
    setLoading(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <IoLanguage className="text-background" size={32} />
          </motion.div>
          <h1 className="text-2xl font-bold">Добро пожаловать</h1>
          <p className="text-muted-foreground mt-1">
            Начните своё путешествие в мир английского
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 space-y-4">
          {/* Google */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleLogin("google")}
            loading={loading === "google"}
            icon={<IoLogoGoogle size={20} />}
          >
            Продолжить с Google
          </Button>

          {/* Telegram */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleLogin("telegram")}
            loading={loading === "telegram"}
            icon={<FaTelegramPlane size={20} />}
          >
            Продолжить с Telegram
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          {/* Guest */}
          <div className="space-y-3">
            <Input
              placeholder="Введите имя (необязательно)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              icon={<IoPerson size={16} />}
            />
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleGuestLogin}
              loading={loading === "guest"}
            >
              Продолжить как гость
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности
        </p>
      </motion.div>
    </div>
  );
}
