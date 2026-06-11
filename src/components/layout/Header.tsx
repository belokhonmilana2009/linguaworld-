"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { IoMoon, IoSunny, IoMenu, IoClose, IoLanguage } from "react-icons/io5";
import { useState } from "react";

const navLinks = [
  { href: ROUTES.LEARN, label: "Обучение" },
  { href: ROUTES.PROFILE, label: "Профиль" },
  { href: ROUTES.STATISTICS, label: "Статистика" },
  { href: ROUTES.DICTIONARY, label: "Словарь" },
  { href: ROUTES.GRAMMAR, label: "Грамматика" },
  { href: ROUTES.CERTIFICATES, label: "Сертификаты" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!mounted) return null;

  const isLanding = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 glass" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? ROUTES.LEARN : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <IoLanguage className="text-background" size={18} />
            </div>
            <span className="font-semibold text-lg tracking-tight">LinguaWorld</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm rounded-xl transition-colors ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-secondary rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href={ROUTES.PROFILE} className="hidden sm:block">
                  <Avatar src={user?.image} name={user?.name} size="sm" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="hidden sm:inline-flex"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <Link href={ROUTES.LOGIN}>
                <Button size="sm">Войти</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-border"
        >
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              Выйти
            </button>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
