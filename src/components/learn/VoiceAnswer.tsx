"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Question } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";
import { IoMic, IoStop } from "react-icons/io5";

interface VoiceAnswerProps {
  question: Question;
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function VoiceAnswer({ question, onSubmit, disabled }: VoiceAnswerProps) {
  const { isRecording, startRecording, stopRecording, error } = useSpeech();
  const [recorded, setRecorded] = useState(false);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const text = await startRecording();
      setRecorded(true);
      onSubmit(text);
    } catch (err) {
      console.error("Recording failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-sm text-muted-foreground text-center">
        Нажмите кнопку и произнесите ответ на английском
      </p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleRecording}
        disabled={disabled}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
          isRecording
            ? "bg-destructive text-white shadow-lg shadow-destructive/30 animate-pulse"
            : "bg-foreground text-background hover:opacity-90"
        } disabled:opacity-50`}
      >
        {isRecording ? <IoStop size={32} /> : <IoMic size={32} />}
      </motion.button>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Запись...</span>
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
