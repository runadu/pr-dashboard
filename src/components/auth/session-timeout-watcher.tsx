"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { buildTimedOutSignInPath } from "@/lib/github-session";

type SessionTimeoutWatcherProps = {
  expiresAt: string;
};

function buildTimeoutRedirectPath(pathname: string, search: string) {
  const callbackUrl = `${pathname}${search}`;
  return buildTimedOutSignInPath(callbackUrl);
}

export function SessionTimeoutWatcher({ expiresAt }: SessionTimeoutWatcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const expiresAtMs = new Date(expiresAt).getTime();

    if (!Number.isFinite(expiresAtMs)) {
      return;
    }

    const search = searchParams.toString();
    const redirectPath = buildTimeoutRedirectPath(pathname, search ? `?${search}` : "");
    const remainingMs = expiresAtMs - Date.now();

    if (remainingMs <= 0) {
      void signOut({ callbackUrl: redirectPath });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void signOut({ callbackUrl: redirectPath });
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [expiresAt, pathname, searchParams]);

  return null;
}
