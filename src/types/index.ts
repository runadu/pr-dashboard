export type PullRequestStatus = "open" | "closed" | "merged";
export type PullRequestTriageQueue =
  | "needs-review"
  | "waiting-on-author"
  | "merge-blocked"
  | "ready-to-merge";
export type PullRequestTriageFilter = "all" | PullRequestTriageQueue;
export type PullRequestFileStatus = "added" | "removed" | "modified";
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
}

export interface PullRequestFile {
  filename: string;
  additions: number;
  deletions: number;
  patch: string;
  status: PullRequestFileStatus;
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
