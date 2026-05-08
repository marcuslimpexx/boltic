import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "user" | "admin";
  }
}
