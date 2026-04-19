import Link from "next/link";
import { CalendarDays, ChevronRight, FolderGit2, MessageSquareText, UserRound } from "lucide-react";
import { TriageBadge } from "@/components/pr/badge";
import type { PullRequest } from "@/types/index";

type CardProps = {
  pullRequest: PullRequest;
};

export function Card({ pullRequest }: CardProps) {
  const href = `/pr/${pullRequest.owner}/${pullRequest.repo}/pulls/${pullRequest.number}`;
  const createdAtText = new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(pullRequest.createdAt));

  return (
    <Link
      className="group block rounded-2xl border border-border bg-card px-4 py-5 transition duration-200 hover:border-accent/30 hover:bg-surface-strong hover:shadow-lg hover:shadow-black/5 sm:px-6 sm:py-6"
      href={href}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
              <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate">
                {pullRequest.owner}/{pullRequest.repo}
              </span>
            </span>

            <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
              #{pullRequest.number}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <h2 className="min-w-0 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
              {pullRequest.title}
            </h2>
            <div className="shrink-0">
              <TriageBadge queue={pullRequest.triageQueue} />
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {pullRequest.triageReason}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <UserRound className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate">{pullRequest.author}</span>
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <CalendarDays className="h-4 w-4 shrink-0 text-accent" />
              <span>{createdAtText}</span>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:w-[220px] lg:items-end">
          <div className="grid grid-cols-2 gap-2 self-stretch">
            <div className="rounded-2xl border border-border bg-background px-3 py-3">
              <p className="text-xs font-medium text-muted">Reviews</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {pullRequest.reviewCount}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background px-3 py-3">
              <p className="text-xs font-medium text-muted">Comments</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {pullRequest.commentCount}
              </p>
            </div>
          </div>

          <div className="inline-flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:text-accent lg:w-auto lg:min-w-[220px]">
            <div className="inline-flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 shrink-0" />
              <span>進入 review workspace</span>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
