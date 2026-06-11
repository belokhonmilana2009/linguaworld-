import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: { label: "ID", type: "text" },
        name: { label: "Name", type: "text" },
        avatar: { label: "Avatar", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.id) {
          return {
            id: String(credentials.id),
            name: String(credentials.name || "Telegram User"),
            image: String(credentials.avatar || ""),
          };
        }
        return null;
      },
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        return {
          id: guestId,
          name: String(credentials.name || "Гость"),
          isGuest: true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = (user as any).isGuest || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).isGuest = token.isGuest as boolean;
      }
      return session;
    },
  },
});
