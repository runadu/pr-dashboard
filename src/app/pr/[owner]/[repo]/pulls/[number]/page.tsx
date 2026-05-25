import Link from "next/link";
import { ArrowLeft, CalendarDays, FolderGit2, UserRound, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { CommentBox } from "@/components/comment/comment-box";
import { DiffViewer } from "@/components/diff/diff-viewer";
import { Header } from "@/components/layout/header";
import { MainLayout } from "@/components/layout/main-layout";
import { LinkedIssuesPanel } from "@/components/pr/linked-issues-panel";
import { StatusBadge, TriageBadge } from "@/components/pr/badge";
import { getPullRequest, getPullRequestFiles, getPullRequestLinkedIssues } from "@/lib/github";
import { buildSessionRequiredSignInPath, redirectOnGitHubAuthError } from "@/lib/github-session";
import { getServerAuth } from "@/lib/server-auth";

type PrDetailPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
};

export default async function PrDetailPage({ params }: PrDetailPageProps) {
  const { owner, repo, number } = await params;
  const { session, accessToken } = await getServerAuth();
  const callbackUrl = `/pr/${owner}/${repo}/pulls/${number}`;

  if (!session || !accessToken) {
    redirect(buildSessionRequiredSignInPath(callbackUrl));
  }

  let pullRequest;
  let files;
  let linkedIssuesResult;

  try {
    [pullRequest, files, linkedIssuesResult] = await Promise.all([
      getPullRequest(accessToken, owner, repo, Number(number)),
      getPullRequestFiles(accessToken, owner, repo, Number(number)),
      getPullRequestLinkedIssues(accessToken, owner, repo, Number(number)),
    ]);
  } catch (error) {
    redirectOnGitHubAuthError(error, callbackUrl);
    throw error;
  }

  const user = {
    name: session.user?.name ?? "使用者",
    email: session.user?.email ?? "",
    avatarUrl: session.user?.image ?? "",
  };
  const createdAtText = new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(pullRequest.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto overflow-hidden border border-border bg-surface divide-y divide-border">
        <Header user={user} />

        <MainLayout sessionExpiresAt={session.expires}>
          <div className="mb-4 lg:mb-6">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              href="/dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>回到儀表板</span>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-border bg-card px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
                        <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                        <span className="truncate">
                          {pullRequest.owner}/{pullRequest.repo}
                        </span>
                      </span>

                      <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                        #{pullRequest.number}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <h1 className="min-w-0 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        {pullRequest.title}
                      </h1>

                      <div className="shrink-0">
                        <TriageBadge queue={pullRequest.triageQueue} />
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {pullRequest.triageReason}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                        <UserRound className="h-4 w-4 shrink-0 text-accent" />
                        <span className="truncate">{pullRequest.author}</span>
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                        <CalendarDays className="h-4 w-4 shrink-0 text-accent" />
                        <span>{createdAtText}</span>
                      </span>

                      <StatusBadge status={pullRequest.status} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 lg:w-55 lg:items-end">
                    <div className="grid grid-cols-2 gap-2 self-stretch">
                      <div className="rounded-2xl border border-border bg-background px-3 py-3">
                        <p className="text-xs font-medium text-muted">Reviews</p>
                        <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                          {pullRequest.reviewCount}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-background px-3 py-3">
                        <p className="text-xs font-medium text-muted">Comments</p>
                        <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                          {pullRequest.commentCount}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={pullRequest.htmlUrl}
                      rel="noreferrer"
                      target="_blank"
                      className="inline-flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/30 hover:bg-accent-soft hover:text-accent lg:w-auto lg:min-w-55"
                    >
                      <div className="inline-flex items-center gap-2">
                        <span>在 GitHub 開啟</span>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
                <CommentBox
                  eyebrow="Review thread"
                  title="留言與回覆"
                  // Writable version previously also passed:
                  // placeholder="留下 review 意見、blocking issue 或 follow-up 建議..."
                  // submitLabel="送出留言"
                  // currentUserName={user.name}
                  // currentUserAvatarUrl={user.avatarUrl}
                />

                <div className="xl:sticky xl:top-5">
                  <LinkedIssuesPanel
                    errorMessage={linkedIssuesResult.error}
                    issues={linkedIssuesResult.issues}
                  />
                </div>
              </div>

              <DiffViewer files={files} />
            </section>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
