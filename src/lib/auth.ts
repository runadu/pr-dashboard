import { AuthOptions } from "next-auth";
import { GitHubAppProvider } from "@/lib/github-app-provider";

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
    GitHubAppProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // GitHub App user access token expires after 8 hours by default.
      // Keep the NextAuth JWT lifetime aligned so the user is forced
      // through a fresh authorization flow before the token goes stale.
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },

    async session({ session }) {
      return session;
    },
  },
};
