import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userRepo } from "@/lib/data";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await userRepo.findByEmail(credentials.email as string);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.id) {
        token["userId"] = user.id;
      }
      if (account) {
        const dbUser = await userRepo.findById(user?.id ?? token.sub ?? "");
        token.role = (dbUser?.role ?? "user") as "user" | "admin";
      }
      return token;
    },
    async session({ session, token }) {
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

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
