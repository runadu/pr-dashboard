"use client";

import Link from "next/link";
import { BadgeCheck, CloudMoon, Sun, Sunrise, GitPullRequest } from "lucide-react";
import { NotificationsMenu } from "@/components/notifications-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useDateTime } from "@/hooks/use-date-time";

type HeaderUser = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

type HeaderProps = {
  user?: HeaderUser;
  variant?: "full" | "minimal";
};

export function Header({ user, variant = "full" }: HeaderProps) {
  const isMinimal = variant === "minimal";
  const { now, timeText, isMorning, isAfternoon, isNight } = useDateTime();
  const greeting = isMorning ? "早安" : isAfternoon ? "午安" : "晚安";
  const fullDateText = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now)
    : "Loading date";
  const TimeIcon = isNight ? CloudMoon : isAfternoon ? Sunrise : Sun;

  return (
    <header className="relative z-20 overflow-visible bg-surface px-4 py-4 sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative">
        {isMinimal ? (
          <div className="flex items-center justify-between gap-3">
            <Link
              className="flex min-w-0 flex-1 items-center gap-3 transition hover:text-accent"
              href="/"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent sm:h-11 sm:w-11">
                <GitPullRequest className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                  PR Dashboard
                </p>
                <p className="truncate text-xs text-muted sm:text-sm">GitHub review workspace</p>
              </div>
            </Link>

            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <Link
                className="flex min-w-0 flex-1 items-center gap-3 transition hover:text-accent"
                href="/"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent sm:h-12 sm:w-12">
                  <GitPullRequest className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    PR Dashboard
                  </p>
                  <p className="truncate text-sm text-muted">GitHub review workspace</p>
                </div>
              </Link>

              {user ? (
                <div className="flex shrink-0 items-start gap-2">
                  <div className="flex items-center justify-end gap-2">
                    <NotificationsMenu />
                    <ThemeToggle />
                  </div>

                  <div className="min-w-0 max-w-[76px] sm:max-w-none">
                    <UserMenu avatarUrl={user.avatarUrl} email={user.email} name={user.name} />
                  </div>
                </div>
              ) : (
                <div className="shrink-0">
                  <ThemeToggle />
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
              <div className="text-sm text-muted-foreground">{fullDateText}</div>

              <div className="flex gap-3 flex-row flex-wrap items-center text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <TimeIcon className="h-4 w-4 shrink-0 text-accent" />
                  <span>{timeText}</span>
                </div>

                <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-xl bg-surface-strong">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate text-sm text-muted-foreground">
                    {greeting}，{user?.name ?? "使用者"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
