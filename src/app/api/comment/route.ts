import { NextRequest, NextResponse } from "next/server";
import { isAppVisibleTarget } from "@/lib/github-visibility";
import { getRouteAccessToken } from "@/lib/server-auth";

const GITHUB_API = "https://api.github.com";

type GitHubCommentKind = "comment" | "review" | "review_comment";

class GitHubResponseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function githubFetchArray(accessToken: string, path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    throw new GitHubResponseError(res.status, `GitHub request failed: ${path}`);
  }

  return (await res.json()) as Record<string, unknown>[];
}

function reviewStateLabel(state: string) {
  const normalized = state.toUpperCase();

  if (normalized === "APPROVED") return "Approved";
  if (normalized === "CHANGES_REQUESTED") return "Changes requested";
  if (normalized === "COMMENTED") return "Reviewed";
  if (normalized === "DISMISSED") return "Review dismissed";

  return "Reviewed";
}

function mapGitHubComment(
  item: Record<string, unknown>,
  kind: GitHubCommentKind,
  fallbackBody = ""
) {
  const user = item.user as Record<string, unknown> | undefined;
  const body = ((item.body as string | undefined) ?? "").trim();

  return {
    id: `${kind}-${String(item.id)}`,
    kind,
    author: (user?.login as string | undefined) ?? "",
    avatarUrl: (user?.avatar_url as string | undefined) ?? "",
    body: body || fallbackBody,
    createdAt:
      ((item.created_at as string | undefined) ?? (item.submitted_at as string | undefined)) ?? "",
    state: (item.state as string | undefined) ?? "",
    path: (item.path as string | undefined) ?? "",
    htmlUrl: (item.html_url as string | undefined) ?? "",
  };
}

export async function GET(req: NextRequest) {
  const accessToken = await getRouteAccessToken(req);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const number = searchParams.get("number");

  if (!owner || !repo || !number) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isVisible = await isAppVisibleTarget(accessToken, {
    owner,
    repo,
    number: Number(number),
  });

  if (!isVisible) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [issueComments, reviews, reviewComments] = await Promise.all([
      githubFetchArray(accessToken, `/repos/${owner}/${repo}/issues/${number}/comments`),
      githubFetchArray(accessToken, `/repos/${owner}/${repo}/pulls/${number}/reviews`),
      githubFetchArray(accessToken, `/repos/${owner}/${repo}/pulls/${number}/comments`),
    ]);

    const comments = [
      ...issueComments.map((comment) => mapGitHubComment(comment, "comment")),
      ...reviews.map((review) =>
        mapGitHubComment(
          review,
          "review",
          reviewStateLabel((review.state as string | undefined) ?? "")
        )
      ),
      ...reviewComments.map((comment) => mapGitHubComment(comment, "review_comment")),
    ]
      .filter((comment) => comment.createdAt)
      .sort((left, right) => {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      });

    return NextResponse.json({ comments });
  } catch (error) {
    if (error instanceof GitHubResponseError && error.status === 401) {
      return NextResponse.json({ error: "SessionExpired" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: error instanceof GitHubResponseError ? error.status : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  /*
  Writable version kept for future restoration:

  const accessToken = await getRouteAccessToken(req);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { owner, repo, number, body } = await req.json();
  if (!owner || !repo || !number || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isVisible = await isAppVisibleTarget(accessToken, {
    owner,
    repo,
    number: Number(number),
  });

  if (!isVisible) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues/${number}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  */
  void req;
  return NextResponse.json({ error: "Comments are read-only" }, { status: 405 });
}
