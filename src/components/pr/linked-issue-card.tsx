import {
  CalendarDays,
  ChevronDown,
  FolderGit2,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { StatusBadge as BaseStatusBadge } from "@/components/ui/status-badge";
import type { PullRequestLinkedIssue } from "@/types";

type LinkedIssueCardProps = {
  issue: PullRequestLinkedIssue;
  expanded?: boolean;
};

const badgeVariants = {
  open: "accent",
  closed: "neutral",
} as const;

const badgeLabels = {
  open: "Open",
  closed: "Closed",
} as const;

export function LinkedIssueCard({ issue, expanded = false }: LinkedIssueCardProps) {
  const displayDate = new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(issue.updatedAt));

  return (
    <div className="flex w-full items-start gap-4 text-left">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <MessageSquareText className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted">
            <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">
              {issue.owner}/{issue.repo}
            </span>
          </span>

          <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
            #{issue.number}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <h3 className="min-w-0 text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {issue.title}
          </h3>

          <div className="shrink-0">
            <BaseStatusBadge
              label={badgeLabels[issue.status]}
              tone={badgeVariants[issue.status]}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
            <UserRound className="h-3.5 w-3.5 text-accent" />
            <span className="truncate">{issue.author || "Unknown"}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
            <MessageSquareText className="h-3.5 w-3.5 text-accent" />
            <span>{issue.commentCount} 則留言</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
            <CalendarDays className="h-3.5 w-3.5 text-accent" />
            <span>{displayDate}</span>
          </span>
        </div>
      </div>

      <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted transition-transform">
        <ChevronDown
          className={["h-4 w-4 transition-transform", expanded ? "rotate-180" : ""].join(" ")}
        />
      </span>
    </div>
  );
}
