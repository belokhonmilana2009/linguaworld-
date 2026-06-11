"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LEVEL_LIST } from "@/lib/constants";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/Badge";
import { IoChevronForward } from "react-icons/io5";

export function Navigation() {
  const pathname = usePathname();
  const { currentLevel, progress } = useProgress();

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Уровни
        </p>
        {LEVEL_LIST.map((level) => {
          const isActive = pathname.includes(level.id);
          const isLocked = level.order > (LEVEL_LIST.findIndex(l => l.id === currentLevel) + 1);

          return (
            <Link
              key={level.id}
              href={isLocked ? "#" : `/learn/${level.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-secondary font-medium"
                  : isLocked
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-base">{level.flag}</span>
              <span className="flex-1">{level.id} — {level.city}</span>
              {isActive && (
                <IoChevronForward size={14} className="text-muted-foreground" />
              )}
            </Link>
          );
        })}

        <div className="mt-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Разделы
          </p>
          {[
            { href: "/grammar", label: "Грамматика", icon: "📚" },
            { href: "/dictionary", label: "Словарь", icon: "📖" },
            { href: "/errors", label: "Мои ошибки", icon: "❌" },
            { href: "/achievements", label: "Достижения", icon: "🏆" },
            { href: "/certificates", label: "Сертификаты", icon: "📜" },
            { href: "/statistics", label: "Статистика", icon: "📊" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                pathname.startsWith(item.href)
                  ? "bg-secondary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
