import { StatusBadge as BaseStatusBadge } from "@/components/ui/status-badge";
import { TRIAGE_QUEUE_LABELS } from "@/lib/triage";
import type { PullRequestStatus, PullRequestTriageQueue } from "@/types";

type StatusBadgeProps = {
  status: PullRequestStatus;
};

type TriageBadgeProps = {
  queue: PullRequestTriageQueue;
};

const statusTone: Record<PullRequestStatus, "accent" | "success" | "neutral"> = {
  open: "accent",
  merged: "success",
  closed: "neutral",
};

const statusLabel: Record<PullRequestStatus, string> = {
  open: "進行中",
  closed: "已關閉",
  merged: "已合併",
};

const triageBadgeVariants: Record<PullRequestTriageQueue, string> = {
  "needs-review": "border-warning/30 bg-warning-soft text-warning",
  "waiting-on-author": "border-destructive/20 bg-destructive-soft text-destructive",
  "merge-blocked": "border-border bg-surface text-muted-foreground",
  "ready-to-merge": "border-success/30 bg-success-soft text-success",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <BaseStatusBadge label={statusLabel[status]} tone={statusTone[status]} />;
}

export function TriageBadge({ queue }: TriageBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.02em]",
        triageBadgeVariants[queue],
      ].join(" ")}
    >
      {TRIAGE_QUEUE_LABELS[queue]}
    </span>
  );
}
