"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  GitPullRequestArrow,
  MessageSquareText,
  ShieldCheck,
  X,
} from "lucide-react";
import { TRIAGE_QUEUE_DESCRIPTIONS, TRIAGE_QUEUE_LABELS } from "@/lib/triage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setQueue } from "@/store/filter-slice";
import { selectPRHasLoaded, selectPRList } from "@/store/pr-slice";
import type { PullRequest, PullRequestTriageQueue } from "@/types";

type NotificationKind = "alert" | "activity" | "success";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  href?: string;
  ctaLabel?: string;
  actionType?: "open-queue";
  queue?: PullRequestTriageQueue;
};

type StoredNotificationState = {
  readIds: string[];
  dismissedIds: string[];
};

const STORAGE_KEY = "pr-dashboard.notifications";

function readStoredNotificationState(): StoredNotificationState {
  if (typeof window === "undefined") {
    return { readIds: [], dismissedIds: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { readIds: [], dismissedIds: [] };

    const parsed = JSON.parse(raw) as Partial<StoredNotificationState>;

    return {
      readIds: Array.isArray(parsed.readIds) ? parsed.readIds : [],
      dismissedIds: Array.isArray(parsed.dismissedIds) ? parsed.dismissedIds : [],
    };
  } catch {
    return { readIds: [], dismissedIds: [] };
  }
}

function buildNotifications(prs: PullRequest[]): NotificationItem[] {
  const notifications: NotificationItem[] = [];
  const queueOrder: PullRequestTriageQueue[] = [
    "needs-review",
    "waiting-on-author",
    "merge-blocked",
    "ready-to-merge",
  ];
  const queueKindMap: Record<PullRequestTriageQueue, NotificationKind> = {
    "needs-review": "alert",
    "waiting-on-author": "activity",
    "merge-blocked": "alert",
    "ready-to-merge": "success",
  };
  const queueCounts = queueOrder.reduce(
    (counts, queue) => {
      counts[queue] = prs.filter((pr) => pr.triageQueue === queue).length;
      return counts;
    },
    {
      "needs-review": 0,
      "waiting-on-author": 0,
      "merge-blocked": 0,
      "ready-to-merge": 0,
    } as Record<PullRequestTriageQueue, number>
  );
  const commentHeavyPRs = [...prs]
    .filter((pr) => pr.commentCount > 0)
    .sort((left, right) => right.commentCount - left.commentCount)
    .slice(0, 2);

  queueOrder.forEach((queue) => {
    const count = queueCounts[queue];
    if (count === 0) return;

    notifications.push({
      id: `queue-${queue}`,
      title: `${count} 筆 ${TRIAGE_QUEUE_LABELS[queue]}`,
      body: TRIAGE_QUEUE_DESCRIPTIONS[queue],
      kind: queueKindMap[queue],
      ctaLabel: "查看 queue",
      actionType: "open-queue",
      queue,
    });
  });

  commentHeavyPRs.forEach((pr) => {
    notifications.push({
      id: `comments-${pr.id}`,
      title: `${pr.owner}/${pr.repo} #${pr.number}`,
      body: `${pr.commentCount} 則留言需要查看，適合直接進入 review workspace。`,
      kind: "activity",
      href: `/pr/${pr.owner}/${pr.repo}/pulls/${pr.number}`,
      ctaLabel: "打開 PR",
    });
  });

  return notifications.slice(0, 4);
}

function NotificationIcon({ kind }: { kind: NotificationKind }) {
  if (kind === "alert") {
    return <GitPullRequestArrow className="h-4 w-4" />;
  }

  if (kind === "success") {
    return <ShieldCheck className="h-4 w-4" />;
  }

  return <MessageSquareText className="h-4 w-4" />;
}

export function NotificationsMenu() {
  const dispatch = useAppDispatch();
  const prList = useAppSelector(selectPRList);
  const hasLoaded = useAppSelector(selectPRHasLoaded);
  const [open, setOpen] = useState(false);
  const [storedState, setStoredState] = useState<StoredNotificationState>(() =>
    readStoredNotificationState()
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
  }, [storedState]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (!window.matchMedia("(max-width: 639px)").matches) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const notifications = buildNotifications(prList);
  const visibleNotifications = notifications.filter(
    (notification) => !storedState.dismissedIds.includes(notification.id)
  );
  const unreadCount = visibleNotifications.filter(
    (notification) => !storedState.readIds.includes(notification.id)
  ).length;

  const markAsRead = (id: string) => {
    setStoredState((current) => ({
      ...current,
      readIds: current.readIds.includes(id) ? current.readIds : [...current.readIds, id],
    }));
  };

  const dismissNotification = (id: string) => {
    setStoredState((current) => ({
      ...current,
      dismissedIds: current.dismissedIds.includes(id)
        ? current.dismissedIds
        : [...current.dismissedIds, id],
      readIds: current.readIds.includes(id) ? current.readIds : [...current.readIds, id],
    }));
  };

  const markAllAsRead = () => {
    setStoredState((current) => ({
      ...current,
      readIds: Array.from(
        new Set([...current.readIds, ...visibleNotifications.map((item) => item.id)])
      ),
    }));
  };

  return (
    <div className="relative z-40" ref={ref}>
      {/* <button
        type="button"
        aria-label="開啟通知"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-foreground transition hover:border-accent/20 hover:bg-accent-soft sm:h-12 sm:w-12"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button> */}
      <button
        type="button"
        aria-label={open ? "關閉通知中心" : "開啟通知中心"}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border text-foreground transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
          open
            ? "border-accent/30 bg-accent-soft shadow-sm"
            : "border-border bg-surface hover:border-foreground/15 hover:bg-surface-strong",
        ].join(" ")}
      >
        <Bell
          className={["h-5 w-5 transition", open ? "text-accent" : "text-foreground"].join(" ")}
        />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[70] hidden sm:block"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[1px] sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            className="
              fixed inset-x-3 top-3 z-[80] max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-2xl border border-border bg-surface-strong p-2 shadow-2xl shadow-black/15
              sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] sm:max-w-[calc(100vw-2rem)] sm:max-h-none sm:inset-x-auto
            "
          >
            <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">通知中心</p>
                <p className="mt-1 text-xs text-muted">
                  {hasLoaded ? `${unreadCount} 則未讀提醒` : "正在整理工作區通知"}
                </p>
              </div>

              <div className="ml-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={!hasLoaded || visibleNotifications.length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-strong text-xs font-medium text-foreground cursor-pointer transition hover:text-accent"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">全部已讀</span>
                  <span className="sm:hidden">已讀</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-strong hover:text-foreground sm:hidden"
                  aria-label="關閉通知"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 max-h-[calc(100dvh-7.5rem)] space-y-2 overflow-y-auto pr-1 sm:max-h-[420px]">
              {!hasLoaded && (
                <div className="rounded-2xl border border-border bg-surface px-4 py-5 text-sm text-muted">
                  正在同步目前工作區的通知…
                </div>
              )}

              {hasLoaded && visibleNotifications.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">目前沒有新的提醒</p>
                </div>
              )}

              {hasLoaded &&
                visibleNotifications.map((notification) => {
                  const isRead = storedState.readIds.includes(notification.id);

                  return (
                    <div
                      key={notification.id}
                      className={[
                        "rounded-2xl border px-4 py-3 transition",
                        isRead
                          ? "border-border bg-surface text-muted"
                          : "border-accent/10 bg-background text-foreground",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                            isRead ? "bg-surface-strong text-muted" : "bg-surface text-accent",
                          ].join(" ")}
                        >
                          <NotificationIcon kind={notification.kind} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted">
                                {notification.body}
                              </p>
                            </div>

                            <button
                              type="button"
                              aria-label="清除此通知"
                              onClick={() => dismissNotification(notification.id)}
                              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {notification.href ? (
                              <Link
                                href={notification.href}
                                onClick={() => {
                                  markAsRead(notification.id);
                                  setOpen(false);
                                }}
                                className="inline-flex items-center rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:text-accent"
                              >
                                {notification.ctaLabel ?? "查看"}
                              </Link>
                            ) : notification.actionType === "open-queue" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  dispatch(setQueue(notification.queue ?? "needs-review"));
                                  markAsRead(notification.id);
                                  setOpen(false);
                                }}
                                className="inline-flex h-8 items-center rounded-xl border border-border bg-surface px-3 text-xs font-medium text-foreground transition hover:border-foreground/15 hover:bg-surface-strong"
                              >
                                {notification.ctaLabel ?? "查看"}
                              </button>
                            ) : null}

                            {!isRead && (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification.id)}
                                className="inline-flex h-8 items-center rounded-xl px-3 text-xs font-medium text-muted transition hover:bg-surface hover:text-foreground"
                              >
                                標示已讀
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
