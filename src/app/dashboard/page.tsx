import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardStats } from "@/components/pr/dashboard-stats";
import { FilterBar } from "@/components/pr/filter-bar";
import { List } from "@/components/pr/list";
import { getPullRequests } from "@/lib/github";
import { buildSessionRequiredSignInPath, redirectOnGitHubAuthError } from "@/lib/github-session";
import { getServerAuth } from "@/lib/server-auth";
import { getPullRequestQueueCounts } from "@/lib/triage";

export default async function DashboardPage() {
  const { session, accessToken, githubLogin } = await getServerAuth();

  if (!session || !accessToken || !githubLogin) {
    redirect(buildSessionRequiredSignInPath("/dashboard"));
  }

  let prs;

  try {
    prs = await getPullRequests(accessToken, githubLogin);
  } catch (error) {
    redirectOnGitHubAuthError(error, "/dashboard");
    throw error;
  }

  const initialQueueCounts = getPullRequestQueueCounts(prs);

  const user = {
    name: session.user?.name ?? "使用者",
    email: session.user?.email ?? "",
    avatarUrl: session.user?.image ?? "",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto overflow-hidden border border-border bg-surface divide-y divide-border">
        <Header user={user} />

        <MainLayout sessionExpiresAt={session.expires}>
          <div className="flex flex-col gap-3">
            <DashboardStats initialQueueCounts={initialQueueCounts} />
            <FilterBar />
            <List initialPRs={prs} />
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
