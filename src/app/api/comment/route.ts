import { NextRequest, NextResponse } from "next/server";
import { isAppVisibleTarget } from "@/lib/github-visibility";
import { getRouteAccessToken } from "@/lib/server-auth";

const GITHUB_API = "https://api.github.com";

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

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues/${number}/comments`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json({ error: "SessionExpired" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to fetch comments" }, { status: res.status });
  }

  const data = await res.json();
  const comments = data.map((c: Record<string, unknown>) => ({
    id: c.id,
    author: (c.user as Record<string, unknown>)?.login ?? "",
    avatarUrl: (c.user as Record<string, unknown>)?.avatar_url ?? "",
    body: c.body,
    createdAt: c.created_at,
  }));

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
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

  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json({ error: "SessionExpired" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to post comment" }, { status: res.status });
  }

  const data = await res.json();
  const comment = {
    id: data.id,
    author: (data.user as Record<string, unknown>)?.login ?? "",
    avatarUrl: (data.user as Record<string, unknown>)?.avatar_url ?? "",
    body: data.body,
    createdAt: data.created_at,
  };

  return NextResponse.json({ comment });
}
