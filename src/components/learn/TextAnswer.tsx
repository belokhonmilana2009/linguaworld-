"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Question } from "@/types";
import { IoPaperPlane } from "react-icons/io5";

interface TextAnswerProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function TextAnswer({ question, onSubmit, disabled }: TextAnswerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите ваш ответ на английском..."
          className="text-lg py-4 h-auto pr-12"
          disabled={disabled}
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!value.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-foreground text-background disabled:opacity-30 transition-opacity"
        >
          <IoPaperPlane size={18} />
        </motion.button>
      </div>
    </form>
  );
}
