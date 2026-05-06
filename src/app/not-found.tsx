import Link from "next/link";
import { LayoutDashboard, LogIn } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">404</p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-card-foreground">
              找不到這個頁面
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              這個網址不存在，或你目前沒有權限查看這筆資料。
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              回到 Dashboard
            </Link>

            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
