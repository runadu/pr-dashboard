import type { PullRequest, PullRequestTriageFilter, PullRequestTriageQueue } from "@/types";

export type TriageQueueCountMap = Record<PullRequestTriageQueue, number>;

export const TRIAGE_QUEUE_LABELS: Record<PullRequestTriageQueue, string> = {
  "needs-review": "Needs review",
  "waiting-on-author": "Waiting on author",
  "merge-blocked": "Merge blocked",
  "ready-to-merge": "Ready to merge",
};

export const TRIAGE_QUEUE_FILTER_LABELS: Record<PullRequestTriageFilter, string> = {
  all: "All",
  ...TRIAGE_QUEUE_LABELS,
};

// 說明文字
export const TRIAGE_QUEUE_DESCRIPTIONS: Record<PullRequestTriageQueue, string> = {
  "needs-review": "等待 reviewer 處理，或目前需要你進行 review 的 Pull Request。",
  "waiting-on-author": "reviewer 已回覆，目前等待提交者更新。",
  "merge-blocked": "接近可合併，但仍受 draft、衝突或 merge 狀態影響。",
  "ready-to-merge": "已符合主要 review 條件，可優先合併。",
};

export const TRIAGE_QUEUE_OPTIONS = [
  { value: "all", label: TRIAGE_QUEUE_FILTER_LABELS.all },
  { value: "needs-review", label: TRIAGE_QUEUE_LABELS["needs-review"] },
  { value: "waiting-on-author", label: TRIAGE_QUEUE_LABELS["waiting-on-author"] },
  { value: "merge-blocked", label: TRIAGE_QUEUE_LABELS["merge-blocked"] },
  { value: "ready-to-merge", label: TRIAGE_QUEUE_LABELS["ready-to-merge"] },
] as const satisfies ReadonlyArray<{
  value: PullRequestTriageFilter;
  label: string;
}>;

// 計數器
export function createEmptyTriageQueueCounts(): TriageQueueCountMap {
  return {
    "needs-review": 0,
    "waiting-on-author": 0,
    "merge-blocked": 0,
    "ready-to-merge": 0,
  };
}

// 計算每個 Queue 的 PR 數量
export function getPullRequestQueueCounts(prs: PullRequest[]): TriageQueueCountMap {
  return prs.reduce((counts, pr) => {
    counts[pr.triageQueue] += 1;
    return counts;
  }, createEmptyTriageQueueCounts());
}
