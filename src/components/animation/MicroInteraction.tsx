"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MicroInteractionProps {
  children: ReactNode;
  type?: "scale" | "bounce" | "slide" | "fade";
  delay?: number;
  className?: string;
}

export function MicroInteraction({
  children,
  type = "fade",
  delay = 0,
  className = "",
}: MicroInteractionProps) {
  const variants = {
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    bounce: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    slide: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  };

  return (
    <motion.div
      variants={variants[type]}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
