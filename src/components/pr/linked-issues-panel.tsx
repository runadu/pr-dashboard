"use client";

import { LinkedIssueExpandableCard } from "@/components/pr/linked-issue-expandable-card";
import type { PullRequestLinkedIssue } from "@/types";

type LinkedIssuesPanelProps = {
  issues: PullRequestLinkedIssue[];
};

export function LinkedIssuesPanel({ issues }: LinkedIssuesPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Linked Issues
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              相關 issue
            </h2>
          </div>

          <span className="text-sm font-medium text-muted-foreground">{issues.length} 筆</span>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted">
            這筆 Pull Request 目前沒有 linked issues。
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <LinkedIssueExpandableCard
                key={`${issue.owner}/${issue.repo}#${issue.number}`}
                defaultExpanded={issues.length === 1 && index === 0}
                issue={issue}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
