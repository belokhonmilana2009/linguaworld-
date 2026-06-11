"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isGuest: (session?.user as any)?.isGuest ?? false,
    login: (provider: string) => signIn(provider),
    loginTelegram: () => signIn("telegram"),
    loginGuest: () => signIn("guest"),
    logout: () => signOut(),
  };
}
