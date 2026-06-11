"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (src && !error) {
    return (
      <div className={`relative ${sizes[size]} rounded-full overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={name || "Avatar"}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  const colors = [
    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  ];

  const colorIndex = name ? name.length % colors.length : 0;

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold ${
        colors[colorIndex]
      } ${className}`}
    >
      {initials}
    </div>
  );
}
