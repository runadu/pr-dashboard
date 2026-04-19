import type {
  IssueStatus,
  PullRequest,
  PullRequestFile,
  PullRequestLinkedIssue,
} from "@/types";

const GITHUB_API = "https://api.github.com";

// 處理 GitHub token 失效
export class GitHubAuthError extends Error {
  status: number; // 保留 HTTP status code

  constructor(message = "GitHub credentials are no longer valid", status = 401) {
    super(message);
    this.name = "GitHubAuthError";
    this.status = status;
  }
}

export function isGitHubAuthError(error: unknown): error is GitHubAuthError {
  return error instanceof GitHubAuthError;
}

// 統一 header：Authorization、Accept、API Version
async function githubFetch(token: string, path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`, // 用 token 驗證身份
      Accept: "application/vnd.github+json", // JSON
      "X-GitHub-Api-Version": "2022-11-28", // 鎖定 API 版本，避免 breaking change
    },
  });

  if (!res.ok) {
    let message = "";

    try {
      const errorData = (await res.json()) as { message?: string };
      if (errorData.message) {
        message = `: ${errorData.message}`;
      }
    } catch {
      message = "";
    }

    if (res.status === 401) {
      throw new GitHubAuthError(
        `GitHub API error: ${res.status} ${res.statusText}${message}`,
        res.status
      );
    }

    throw new Error(`GitHub API error: ${res.status} ${res.statusText}${message}`);
  }

  return res.json();
}

async function githubGraphQLFetch<TData>(
  token: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const res = await fetch(`${GITHUB_API}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await res.json()) as {
    data?: TData;
    errors?: Array<{ message?: string }>;
  };

  if (!res.ok || payload.errors?.length || !payload.data) {
    const errorMessage = payload.errors
      ?.map((error) => error.message)
      .filter(Boolean)
      .join("; ");

    if (res.status === 401) {
      throw new GitHubAuthError(errorMessage || `GitHub GraphQL error: ${res.status}`, res.status);
    }

    throw new Error(errorMessage || `GitHub GraphQL error: ${res.status}`);
  }

  return payload.data;
}

function buildIssueSearchPath(query: string, perPage = 40) {
  return `/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${perPage}`;
}

function extractRepoRef(item: Record<string, unknown>) {
  const repoUrl = item.repository_url as string;
  const parts = repoUrl.split("/");

  return {
    owner: parts[parts.length - 2],
    repo: parts[parts.length - 1],
    number: item.number as number,
  };
}

function dedupeAndSortIssueItems(items: Record<string, unknown>[]) {
  const uniqueItems = new Map<number, Record<string, unknown>>();

  items.forEach((item) => {
    uniqueItems.set(item.id as number, item);
  });

  return [...uniqueItems.values()].sort((left, right) => {
    const leftUpdated = new Date((left.updated_at as string | undefined) ?? 0).getTime();
    const rightUpdated = new Date((right.updated_at as string | undefined) ?? 0).getTime();
    return rightUpdated - leftUpdated;
  });
}

function getLatestReviewsByReviewer(reviews: Record<string, unknown>[], authorLogin: string) {
  const latestByReviewer = new Map<string, Record<string, unknown>>();

  const sortedReviews = [...reviews].sort((left, right) => {
    const leftTime = new Date((left.submitted_at as string | undefined) ?? 0).getTime();
    const rightTime = new Date((right.submitted_at as string | undefined) ?? 0).getTime();
    return leftTime - rightTime;
  });

  for (const review of sortedReviews) {
    const reviewer = ((review.user as Record<string, unknown> | undefined)?.login ?? "") as string;
    if (!reviewer || reviewer.toLowerCase() === authorLogin.toLowerCase()) continue;
    latestByReviewer.set(reviewer.toLowerCase(), review);
  }

  return [...latestByReviewer.values()];
}

function buildStableNumericId(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

function isMergeReadyState(mergeableState: string | null, isDraft: boolean) {
  if (isDraft) return false;
  return mergeableState === "clean" || mergeableState === "has_hooks";
}

function getTriageClassification({
  isAuthor,
  isDraft,
  mergeableState,
  hasPendingReviewRequests,
  hasApproval,
  hasChangesRequested,
}: {
  isAuthor: boolean;
  isDraft: boolean;
  mergeableState: string | null;
  hasPendingReviewRequests: boolean;
  hasApproval: boolean;
  hasChangesRequested: boolean;
}): Pick<PullRequest, "triageQueue" | "triageReason"> {
  if (!isAuthor) {
    return {
      triageQueue: "needs-review",
      triageReason: hasPendingReviewRequests
        ? "你目前是這筆 Pull Request 的 reviewer。"
        : "這筆 Pull Request 目前在你的 review queue 內。",
    };
  }

  if (hasChangesRequested) {
    return {
      triageQueue: "waiting-on-author",
      triageReason: "reviewer 已要求修改，下一步由 author 回應。",
    };
  }

  if (hasApproval && isMergeReadyState(mergeableState, isDraft) && !hasPendingReviewRequests) {
    return {
      triageQueue: "ready-to-merge",
      triageReason: "已取得 approval，且目前 merge 狀態允許合併。",
    };
  }

  if (isDraft) {
    return {
      triageQueue: "merge-blocked",
      triageReason: "這筆 Pull Request 仍是 draft，尚未進入可合併狀態。",
    };
  }

  if (
    hasApproval ||
    mergeableState === "dirty" ||
    mergeableState === "blocked" ||
    mergeableState === "behind" ||
    mergeableState === "unstable" ||
    mergeableState === "unknown"
  ) {
    return {
      triageQueue: "merge-blocked",
      triageReason: "已接近完成，但 merge 條件、同步狀態或檢查結果仍有阻擋。",
    };
  }

  return {
    triageQueue: "needs-review",
    triageReason: hasPendingReviewRequests
      ? "等待 reviewer 完成 review。"
      : "這筆 Pull Request 仍在等待 review 結果。",
  };
}

// 1. 抓 triage 導向的 cross-repo PR queue
export async function getPullRequests(token: string): Promise<PullRequest[]> {
  const viewer = (await githubFetch(token, "/user")) as Record<string, unknown>;
  const viewerLogin = ((viewer.login as string | undefined) ?? "").toLowerCase();
  const [authoredResult, reviewRequestedResult] = await Promise.allSettled([
    githubFetch(token, buildIssueSearchPath(`is:pr is:open archived:false author:${viewerLogin}`)),
    githubFetch(
      token,
      buildIssueSearchPath(`is:pr is:open archived:false review-requested:${viewerLogin}`)
    ),
  ]);

  const authoredItems =
    authoredResult.status === "fulfilled"
      ? (((authoredResult.value as Record<string, unknown>).items as
          | Record<string, unknown>[]
          | undefined) ?? [])
      : [];
  const reviewRequestedItems =
    reviewRequestedResult.status === "fulfilled"
      ? (((reviewRequestedResult.value as Record<string, unknown>).items as
          | Record<string, unknown>[]
          | undefined) ?? [])
      : [];

  if (authoredResult.status === "rejected" && reviewRequestedResult.status === "rejected") {
    throw authoredResult.reason;
  }

  const items = dedupeAndSortIssueItems([...authoredItems, ...reviewRequestedItems]).slice(0, 40);

  const settledResults = await Promise.allSettled(
    items.map(async (item) => {
      const { owner, repo, number } = extractRepoRef(item);
      const [prDetail, reviews] = await Promise.all([
        githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}`),
        githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`),
      ]);

      const author = ((item.user as Record<string, unknown> | undefined)?.login ?? "") as string;
      const authorLogin = author.toLowerCase();
      const isAuthor = authorLogin === viewerLogin;
      const latestReviews = getLatestReviewsByReviewer(
        (reviews as Record<string, unknown>[] | undefined) ?? [],
        author
      );
      const hasApproval = latestReviews.some((review) => review.state === "APPROVED");
      const hasChangesRequested = latestReviews.some(
        (review) => review.state === "CHANGES_REQUESTED"
      );
      const requestedReviewers =
        (prDetail.requested_reviewers as Record<string, unknown>[] | undefined) ?? [];
      const requestedTeams =
        (prDetail.requested_teams as Record<string, unknown>[] | undefined) ?? [];
      const hasPendingReviewRequests = requestedReviewers.length > 0 || requestedTeams.length > 0;
      const status: PullRequest["status"] = (
        (item.state as string) === "closed" ? "closed" : "open"
      ) as PullRequest["status"];
      const isDraft = Boolean(prDetail.draft);
      const mergeableState = (prDetail.mergeable_state as string | null | undefined) ?? null;
      const triage = getTriageClassification({
        isAuthor,
        isDraft,
        mergeableState,
        hasPendingReviewRequests,
        hasApproval,
        hasChangesRequested,
      });

      return {
        id: item.id as number,
        number,
        title: item.title as string,
        repo,
        owner,
        status,
        author,
        createdAt: item.created_at as string,
        updatedAt: ((prDetail.updated_at as string | undefined) ??
          (item.updated_at as string | undefined) ??
          "") as string,
        reviewCount: latestReviews.length,
        commentCount:
          ((item.comments as number | undefined) ?? 0) +
          ((prDetail.review_comments as number | undefined) ?? 0),
        triageQueue: triage.triageQueue,
        triageReason: triage.triageReason,
        isDraft,
        mergeableState,
      } satisfies PullRequest;
    })
  );

  return settledResults
    .filter(
      (result): result is PromiseFulfilledResult<PullRequest> => result.status === "fulfilled"
    )
    .map((result) => result.value);
}

export async function getPullRequestLinkedIssues(
  token: string,
  owner: string,
  repo: string,
  number: number
): Promise<PullRequestLinkedIssue[]> {
  try {
    const data = await githubGraphQLFetch<{
      repository?: {
        pullRequest?: {
          closingIssuesReferences?: {
            nodes?: Array<{
              id: string;
              number: number;
              title: string;
              body?: string | null;
              url: string;
              createdAt: string;
              updatedAt: string;
              state: "OPEN" | "CLOSED";
              comments?: { totalCount?: number | null } | null;
              author?: { login?: string | null } | null;
              repository?: {
                name: string;
                owner?: { login?: string | null } | null;
              } | null;
              labels?: {
                nodes?: Array<{ name?: string | null; color?: string | null } | null> | null;
              } | null;
            } | null> | null;
          } | null;
        } | null;
      } | null;
    }>(
      token,
      `
        query PullRequestLinkedIssues($owner: String!, $repo: String!, $number: Int!) {
          repository(owner: $owner, name: $repo) {
            pullRequest(number: $number) {
              closingIssuesReferences(first: 20, userLinkedOnly: false) {
                nodes {
                  id
                  number
                  title
                  body
                  url
                  createdAt
                  updatedAt
                  state
                  comments {
                    totalCount
                  }
                  author {
                    login
                  }
                  repository {
                    name
                    owner {
                      login
                    }
                  }
                  labels(first: 6) {
                    nodes {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { owner, repo, number }
    );

    const issues =
      data.repository?.pullRequest?.closingIssuesReferences?.nodes
        ?.filter((issue): issue is NonNullable<typeof issue> => Boolean(issue))
        .map((issue) => ({
          id: buildStableNumericId(
            `${issue.repository?.owner?.login ?? owner}/${issue.repository?.name ?? repo}#${issue.number}`
          ),
          number: issue.number,
          title: issue.title,
          owner: issue.repository?.owner?.login ?? owner,
          repo: issue.repository?.name ?? repo,
          author: issue.author?.login ?? "",
          authorAvatarUrl: null,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          commentCount: issue.comments?.totalCount ?? 0,
          status: (issue.state === "CLOSED" ? "closed" : "open") as IssueStatus,
          linkedPullRequestCount: 1,
          body: issue.body ?? "",
          htmlUrl: issue.url,
          labels:
            issue.labels?.nodes
              ?.filter((label): label is NonNullable<typeof label> => Boolean(label?.name))
              .map((label) => ({
                name: label.name ?? "",
                color: label.color ?? "94a3b8",
              })) ?? [],
        }))
        .sort((left, right) => {
          if (left.status !== right.status) {
            return left.status === "open" ? -1 : 1;
          }

          return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
        }) ?? [];

    return issues;
  } catch {
    return [];
  }
}

// 2. 抓某個 PR 的所有異動檔案
// 回傳每個檔案的 patch（就是 diff 內容），給 DiffViewer 顯示
export async function getPullRequestFiles(
  token: string,
  owner: string,
  repo: string,
  number: number
): Promise<PullRequestFile[]> {
  const data = await githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}/files`);
  return data.map((file: Record<string, unknown>) => ({
    filename: file.filename as string,
    status: file.status as PullRequestFile["status"],
    additions: file.additions as number,
    deletions: file.deletions as number,
    patch: (file.patch as string) ?? "",
  }));
}

// 3. 對某個 PR 發表評論
// 用 POST 打 GitHub Issues Comments API
// PR 在 GitHub 內部就是一種 Issue，所以用 issues endpoint
export async function postComment(
  token: string,
  owner: string,
  repo: string,
  number: number,
  body: string
): Promise<void> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues/${number}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`Failed to post comment: ${res.status}`);
}
