"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Question } from "@/types";
import { IoImage, IoPaperPlane } from "react-icons/io5";

interface ImageQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function ImageQuestion({ question, onSubmit, disabled }: ImageQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Image placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-video bg-secondary rounded-2xl flex items-center justify-center overflow-hidden"
      >
        {question.imagePrompt ? (
          <div className="relative w-full h-full">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-border">
              <div className="text-center p-8">
                <IoImage size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Изображение: {question.imagePrompt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <IoImage size={48} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Изображение загружается...</p>
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Опишите изображение на английском..."
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
