"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CircleDashed,
  ExternalLink,
  MessageSquareText,
} from "lucide-react";
import { StatusBadge as BaseStatusBadge } from "@/components/ui/status-badge";
import type { PullRequestLinkedIssue } from "@/types";

type LinkedIssuesPanelProps = {
  issues: PullRequestLinkedIssue[];
  errorMessage?: string | null;
};

type LinkedIssueRowProps = {
  issue: PullRequestLinkedIssue;
};

const issueStatusTone = {
  open: "accent",
  closed: "neutral",
} as const;

const issueStatusLabel = {
  open: "Open",
  closed: "Closed",
} as const;

function LinkedIssueRow({ issue }: LinkedIssueRowProps) {
  const displayDate = new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
  }).format(new Date(issue.updatedAt));
  const visibleLabels = issue.labels.slice(0, 2);
  const hiddenLabelCount = Math.max(issue.labels.length - visibleLabels.length, 0);

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-background">
      <header className="flex flex-col gap-3 bg-surface p-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <BaseStatusBadge
                label={issueStatusLabel[issue.status]}
                tone={issueStatusTone[issue.status]}
              />

              <p className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-foreground">
                {issue.title}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="font-medium text-muted">
                {issue.owner}/{issue.repo} #{issue.number}
              </span>
              <span className="inline-flex items-center gap-1">by {issue.author || "Unknown"}</span>
              <span className="inline-flex items-center gap-1">
                <MessageSquareText className="h-3.5 w-3.5 text-accent" />
                <span>{issue.commentCount} 則留言</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-accent" />
                <span>更新於 {displayDate}</span>
              </span>
              {visibleLabels.map((label) => (
                <span
                  key={label.name}
                  className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    borderColor: `#${label.color}55`,
                    backgroundColor: `#${label.color}1a`,
                    color: `#${label.color}`,
                  }}
                >
                  {label.name}
                </span>
              ))}
              {hiddenLabelCount > 0 ? (
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
                  +{hiddenLabelCount}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start whitespace-nowrap pl-0 text-xs font-semibold sm:pl-3">
            <Link
              href={issue.htmlUrl}
              rel="noreferrer"
              target="_blank"
              aria-label={`在 GitHub 開啟 ${issue.owner}/${issue.repo}#${issue.number}`}
              title="在 GitHub 開啟"
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background text-muted transition hover:border-accent/30 hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>
    </article>
  );
}

export function LinkedIssuesPanel({ issues, errorMessage }: LinkedIssuesPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Linked Issues
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            相關 issue
          </h2>
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          <span>{issues.length}</span>
          <span className="ml-2">筆</span>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        {errorMessage ? (
          <div className="rounded-xl border border-warning/30 bg-warning-soft px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-warning">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">相關 issue 載入失敗</p>
                <p className="text-sm leading-6 text-muted">{errorMessage}</p>
              </div>
            </div>
          </div>
        ) : issues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background px-4 py-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted">
                <CircleDashed className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">目前沒有關聯工作項目</p>
                <p className="text-sm leading-6 text-muted">
                  這筆 Pull Request 目前沒有 linked issues。
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {issues.map((issue) => (
              <LinkedIssueRow key={`${issue.owner}/${issue.repo}#${issue.number}`} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
