import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MainLayout } from "@/components/layout/main-layout";
import { Workspace } from "@/components/pr/workspace";
import { getPullRequests } from "@/lib/github";
import { redirectOnGitHubAuthError } from "@/lib/github-session";
import { getServerAuth } from "@/lib/server-auth";
import { getPullRequestQueueCounts } from "@/lib/triage";

export default async function DashboardPage() {
  const { session, accessToken } = await getServerAuth();

  if (!session || !accessToken) {
    redirect("/signin?callbackUrl=%2Fdashboard");
  }

  let prs;

  try {
    prs = await getPullRequests(accessToken);
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
    <div className="min-h-screen bg-background text-foreground px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto overflow-hidden border border-border bg-surface divide-y divide-border">
        <Header user={user} />

        <MainLayout sessionExpiresAt={session.expires}>
          <Workspace initialPRs={prs} initialQueueCounts={initialQueueCounts} />
        </MainLayout>
      </div>
    </div>
  );
}
