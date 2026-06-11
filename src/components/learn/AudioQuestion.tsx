"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Question } from "@/types";
import { speakText } from "@/lib/speech";
import { IoVolumeHigh, IoPaperPlane } from "react-icons/io5";

interface AudioQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function AudioQuestion({ question, onSubmit, disabled }: AudioQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => speakText(question.question, 0.85)}
          className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg"
        >
          <IoVolumeHigh size={32} />
        </motion.button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Прослушайте аудио и напишите, что вы услышали
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Что вы услышали?"
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
