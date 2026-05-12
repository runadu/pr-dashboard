import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const AUTH_SESSION_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
    error: "/signin",
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
        // Security note:
        // GitHub classic OAuth scopes are coarse-grained. This app needs to read
        // private-repo Pull Requests / linked Issues and post comments, so it
        // currently relies on the broad `repo` scope. Treat this as an accepted
        // short-term tradeoff, keep token usage server-side only, and prefer a
        // GitHub App migration long-term if least-privilege becomes a priority.
        params: { scope: "repo" },
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
