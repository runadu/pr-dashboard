export type PullRequestStatus = "open" | "closed" | "merged";
export type PullRequestReviewDecision =
  | "approved"
  | "changes_requested"
  | "review_required"
  | "commented"
  | "none";
export type PullRequestCheckState = "passing" | "failing" | "pending" | "unavailable";
export type PullRequestTriageQueue =
  | "needs-review"
  | "waiting-on-author"
  | "merge-blocked"
  | "ready-to-merge";
export type PullRequestTriageFilter = "all" | PullRequestTriageQueue;
export type PullRequestFileStatus = "added" | "removed" | "modified" | "renamed";
export type PullRequestFileContentMode =
  | "full"
  | "patch"
  | "binary"
  | "oversized"
  | "unavailable";
export type IssueStatus = "open" | "closed";

export interface GitHubRepositoryRef {
  owner: string;
  repo: string;
}

export interface GitHubReviewer {
  login: string;
  avatarUrl?: string;
}

export interface GitHubIssueLabel {
  name: string;
  color: string;
}

export interface PullRequestCheckSummary {
  state: PullRequestCheckState;
  totalCount: number;
  passingCount: number;
  failingCount: number;
  pendingCount: number;
}

export interface PullRequest extends GitHubRepositoryRef {
  id: number;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  commentCount: number;
  status: PullRequestStatus;
  triageQueue: PullRequestTriageQueue;
  triageReason: string;
  isDraft: boolean;
  mergeableState: string | null;
  htmlUrl: string;
  reviewDecision?: PullRequestReviewDecision;
  pendingReviewers?: string[];
  checkSummary?: PullRequestCheckSummary;
}

export interface PullRequestFile {
  filename: string;
  previousFilename?: string | null;
  additions: number;
  deletions: number;
  patch: string;
  status: PullRequestFileStatus;
  oldCode: string | null;
  newCode: string | null;
  contentMode: PullRequestFileContentMode;
}

export interface GitHubIssueDetail extends GitHubRepositoryRef {
  id: number;
  number: number;
  title: string;
  author: string;
  authorAvatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  status: IssueStatus;
  linkedPullRequestCount: number;
  body: string;
  htmlUrl: string;
  labels?: GitHubIssueLabel[];
}

export type GitHubIssuePreview = GitHubIssueDetail;

export interface PullRequestLinkedIssue extends GitHubIssueDetail {
  labels: GitHubIssueLabel[];
}

export interface PullRequestLinkedIssuesResult {
  issues: PullRequestLinkedIssue[];
  error: string | null;
}
