import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const AUTH_SESSION_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: AUTH_SESSION_EXPIRY_SECONDS,
  },
  jwt: {
    maxAge: AUTH_SESSION_EXPIRY_SECONDS,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: "repo" }, // 讀 private repo 的 PR/Issue 並留言的最小權限
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 第一次登入時 account 有值，把 access_token 存進 JWT
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },

    async session({ session }) {
      return session;
    },
  },
};
