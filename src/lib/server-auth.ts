import { cookies, headers } from "next/headers";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

type TokenPayload = {
  accessToken?: unknown;
  githubLogin?: unknown;
} | null;

type ServerAuthResult = {
  session: Session | null;
  accessToken: string | null;
  githubLogin: string | null;
};

function extractAccessToken(token: TokenPayload) {
  return typeof token?.accessToken === "string" ? token.accessToken : null;
}

function extractGitHubLogin(token: TokenPayload) {
  return typeof token?.githubLogin === "string" ? token.githubLogin : null;
}

async function getServerToken() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  return getToken({
    req: {
      cookies: cookieStore,
      headers: headerStore,
    } as unknown as NextRequest,
  });
}

export async function getServerAuth(): Promise<ServerAuthResult> {
  const [session, token] = await Promise.all([getServerSession(authOptions), getServerToken()]);

  return {
    session,
    accessToken: extractAccessToken(token),
    githubLogin: extractGitHubLogin(token),
  };
}

export async function getRouteAuth(req: NextRequest) {
  const token = await getToken({ req });

  return {
    accessToken: extractAccessToken(token),
    githubLogin: extractGitHubLogin(token),
  };
}
