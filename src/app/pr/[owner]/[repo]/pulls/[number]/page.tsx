import Link from "next/link";
import { ArrowLeft, FolderGit2, GitPullRequest, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { CommentBox } from "@/components/comment/comment-box";
import { DiffViewer } from "@/components/diff/diff-viewer";
import { Header } from "@/components/layout/header";
import { MainLayout } from "@/components/layout/main-layout";
import { LinkedIssuesPanel } from "@/components/pr/linked-issues-panel";
import { StatusBadge } from "@/components/pr/badge";
import { getPullRequestFiles, getPullRequestLinkedIssues, getPullRequests } from "@/lib/github";
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

  let prs;
  let files;
  let linkedIssues;

  try {
    [prs, files, linkedIssues] = await Promise.all([
      getPullRequests(accessToken),
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

  const pullRequest = prs.find(
    (item) => item.owner === owner && item.repo === repo && item.number === Number(number)
  );

  if (!pullRequest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto overflow-hidden border border-border bg-surface divide-y divide-border">
        <Header user={user} />

        <MainLayout sessionExpiresAt={session.expires}>
          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-border bg-surface px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                    href="/dashboard"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>回到儀表板</span>
                  </Link>
                </div>

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
                        <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                        <span className="truncate">
                          {pullRequest.owner}/{pullRequest.repo}
                        </span>
                      </span>

                      <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                        PR #{pullRequest.number}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <h1 className="min-w-0 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {pullRequest.title}
                      </h1>

                      <div className="shrink-0">
                        <StatusBadge status={pullRequest.status} />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                        <UserRound className="h-4 w-4 shrink-0 text-accent" />
                        <span className="truncate">{pullRequest.author}</span>
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                        <GitPullRequest className="h-4 w-4 shrink-0 text-accent" />
                        <span className="truncate">
                          {pullRequest.owner}/{pullRequest.repo} #{pullRequest.number}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:w-fit xl:min-w-[260px]">
                    <div className="rounded-2xl border border-border bg-background px-4 py-3">
                      <p className="text-xs font-medium text-muted">Files changed</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                        {files.length}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background px-4 py-3">
                      <p className="text-xs font-medium text-muted">Comments</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                        {pullRequest.commentCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-5">
              <CommentBox
                eyebrow="Review thread"
                title="留言與回覆"
                placeholder="留下 review 意見、blocking issue 或 follow-up 建議..."
                submitLabel="送出留言"
                currentUserName={user.name}
                currentUserAvatarUrl={user.avatarUrl}
              />

              <LinkedIssuesPanel issues={linkedIssues} />

              <DiffViewer files={files} />
            </section>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
