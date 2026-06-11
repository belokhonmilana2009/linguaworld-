"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Question } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { IoPaperPlane } from "react-icons/io5";

interface TranslationQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function TranslationQuestion({ question, onSubmit, disabled }: TranslationQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const isRuToEn = question.type === "translation_ru_en";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Badge variant="info" size="md">
          {isRuToEn ? "Русский" : "English"}
        </Badge>
        <span className="text-muted-foreground">→</span>
        <Badge variant="success" size="md">
          {isRuToEn ? "English" : "Русский"}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              isRuToEn ? "Введите перевод на английский..." : "Введите перевод на русский..."
            }
            className="text-lg py-4 h-auto pr-12"
            disabled={disabled}
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!value.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-foreground text-background disabled:opacity-30"
          >
            <IoPaperPlane size={18} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
