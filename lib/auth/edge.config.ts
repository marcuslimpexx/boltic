import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — no Node.js modules (no bcryptjs, no DB).
 * Used only in middleware.ts which runs on the Edge Runtime.
 * The full config with Credentials provider lives in lib/auth/config.ts.
 */
export const edgeAuthConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token["userId"] = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token["userId"]) {
        (session.user as { id?: string }).id = token["userId"] as string;
      }
      if (session.user) {
        session.user.role = (token.role as "user" | "admin") ?? "user";
      }
      return session;
    },
  },
};
