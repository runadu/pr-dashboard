import { redirect } from "next/navigation";
import { isGitHubAuthError } from "@/lib/github";

export function buildReauthPath(callbackUrl: string) {
  return `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=SessionExpired&forceLogin=1`;
}

export function redirectOnGitHubAuthError(error: unknown, callbackUrl: string): never | void {
  if (isGitHubAuthError(error)) {
    redirect(buildReauthPath(callbackUrl));
  }
}
