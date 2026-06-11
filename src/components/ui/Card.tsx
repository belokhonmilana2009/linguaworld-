"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = true, glow = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      whileTap={hover && onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`bg-card border border-border rounded-2xl p-6 transition-all duration-300 ${
        glow ? "shadow-lg shadow-foreground/5" : "shadow-sm"
      } ${hover ? "hover:shadow-xl hover:shadow-foreground/5" : ""} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
