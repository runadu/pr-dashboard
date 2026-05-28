"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-destructive">系統錯誤</p>

          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
            無法載入這個頁面
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            PR Dashboard 在處理目前請求時發生問題。這可能是 GitHub
            API、登入狀態、網路連線或暫時性的伺服器錯誤。
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface px-4 py-3">
          <p className="text-sm font-medium text-foreground">你可以先嘗試：</p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            <li>重新整理目前頁面</li>
            <li>回到 Dashboard 重新載入 PR 清單</li>
            <li>如果問題持續發生，重新登入 GitHub</li>
          </ul>
        </div>

        {error.digest ? (
          <div className="mt-4 rounded-md border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Error digest
            </p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{error.digest}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={unstable_retry}
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            重新嘗試
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            回到 Dashboard
          </Link>

          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            重新登入
          </Link>
        </div>
      </section>
    </main>
  );
}
