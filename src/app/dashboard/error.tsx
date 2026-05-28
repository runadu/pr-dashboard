"use client";

import Link from "next/link";
import { LogIn, RotateCcw } from "lucide-react";
import { useEffect } from "react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry: () => void;
};

export default function DashboardError({ error, unstable_retry }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", {
      message: error.message,
      digest: error.digest,
      error,
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <div
          role="alert"
          aria-live="assertive"
          className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8"
        >
          <div>
            <p className="text-sm font-medium text-destructive">Dashboard 載入失敗</p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-card-foreground">
              無法取得 Pull Request 資料
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              請重新載入 Dashboard，或重新登入 GitHub 後再試一次。
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={unstable_retry}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              重新載入
            </button>

            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <LogIn className="size-4" aria-hidden="true" />
              重新登入
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
