"use client";

import { useState, useCallback } from "react";
import { speechService, speakText } from "@/lib/speech";

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async (): Promise<string> => {
    if (!speechService.supported) {
      setError("Голосовой ввод не поддерживается в вашем браузере");
      throw new Error("Speech not supported");
    }

    setIsRecording(true);
    setError(null);

    try {
      const text = await speechService.startRecording();
      return text;
    } catch (err: any) {
      setError(err.message || "Ошибка записи");
      throw err;
    } finally {
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    speechService.stopRecording();
    setIsRecording(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      await speakText(text);
    } catch (err) {
      console.error("Speech error:", err);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  return {
    isRecording,
    isSpeaking,
    error,
    startRecording,
    stopRecording,
    speak,
  };
}
