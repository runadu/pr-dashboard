"use client";

import { useState } from "react";
import { LinkedIssueCard } from "@/components/pr/linked-issue-card";
import { LinkedIssuePreview } from "@/components/pr/linked-issue-preview";
import type { PullRequestLinkedIssue } from "@/types";

type LinkedIssueExpandableCardProps = {
  issue: PullRequestLinkedIssue;
  defaultExpanded?: boolean;
};

export function LinkedIssueExpandableCard({
  issue,
  defaultExpanded = false,
}: LinkedIssueExpandableCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full px-4 py-4 transition-colors hover:bg-surface-strong cursor-pointer"
      >
        <LinkedIssueCard expanded={expanded} issue={issue} />
      </button>

      {expanded && <LinkedIssuePreview issue={issue} />}
    </article>
  );
}
