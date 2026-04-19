"use client";

import { DashboardStats } from "@/components/pr/dashboard-stats";
import { FilterBar } from "@/components/pr/filter-bar";
import { List } from "@/components/pr/list";
import type { TriageQueueCountMap } from "@/lib/triage";
import type { PullRequest } from "@/types";

type WorkspaceProps = {
  initialPRs: PullRequest[];
  initialQueueCounts: TriageQueueCountMap;
  lastReviewedAt?: string | null;
};

export function Workspace({ initialPRs, initialQueueCounts }: WorkspaceProps) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <DashboardStats initialQueueCounts={initialQueueCounts} />
        <FilterBar />
        <List initialPRs={initialPRs} />
      </div>
    </>
  );
}
