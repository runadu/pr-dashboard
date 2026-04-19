import { Filter, GitPullRequest, PanelsTopLeft, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { GithubSignInButton } from "@/components/auth/github-sign-in-button";
import { Header } from "@/components/layout/header";
import { getServerAuth } from "@/lib/server-auth";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    forceLogin?: string | string[];
  }>;
};

function normalizeCallbackUrl(callbackUrl?: string | string[]): string {
  const value = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;

  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";

  return value;
}

function getErrorMessage(error?: string | string[]): string | null {
  const value = Array.isArray(error) ? error[0] : error;

  if (!value) return null;

  switch (value) {
    case "AccessDenied":
      return "GitHub 授權被取消，請重新登入。";
    case "SessionExpired":
      return "GitHub 憑證已失效，請重新連接 GitHub。";
    case "SessionTimedOut":
      return "登入已逾時，請重新登入。";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "GitHub 登入流程發生問題，請稍後再試。";
    default:
      return "登入失敗，請重新嘗試。";
  }
}

const signInNotes = [
  {
    icon: GitPullRequest,
    title: "集中處理審查",
    description: "在同一頁查看 PR、Issue 與審查狀態。",
  },
  {
    icon: Filter,
    title: "快速篩選",
    description: "依 queue、repo 或關鍵字縮小範圍。",
  },
  {
    icon: PanelsTopLeft,
    title: "查看 PR 與 Issue",
    description: "不必切回 GitHub。",
  },
  {
    icon: ShieldCheck,
    title: "最小授權",
    description: "只請求必要的 GitHub 權限。",
  },
] as const;

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { session, accessToken } = await getServerAuth();
  const query = await searchParams;
  const callbackUrl = normalizeCallbackUrl(query.callbackUrl);
  const errorMessage = getErrorMessage(query.error);
  const forceLogin =
    (Array.isArray(query.forceLogin) ? query.forceLogin[0] : query.forceLogin) === "1";

  if (session && accessToken && !forceLogin) {
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto w-full overflow-hidden border border-border bg-surface">
        <Header variant="minimal" />

        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
              <div className="flex flex-col justify-center lg:col-span-7 lg:pr-8 xl:col-span-8 xl:pr-12">
                <div className="inline-flex w-fit items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                  <GitPullRequest className="h-3.5 w-3.5" />
                  <span>Pull Request Workspace</span>
                </div>

                <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.9rem] sm:leading-tight">
                  在同一個工作區處理 PR 審查
                </h1>

                <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">
                  連接 GitHub 後，你可以在儀表板集中查看 PR、Issue
                  與審查狀態，減少在多個頁面之間切換。
                </p>

                <div className="mt-8 max-w-2xl space-y-4">
                  {signInNotes.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 border-t border-border/70 pt-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="mt-1 text-sm text-muted">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 lg:flex xl:col-span-4">
                <div className="w-full rounded-2xl border border-border bg-background p-5 sm:p-6 lg:ml-auto lg:flex lg:h-full lg:max-w-md lg:flex-col">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                      Sign In
                    </p>

                    <h2 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-foreground">
                      使用 GitHub 登入
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                      完成授權後即可進入工作區；若憑證失效，也可在這裡重新連接。
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {errorMessage && (
                      <div className="border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-foreground">
                        {errorMessage}
                      </div>
                    )}

                    <GithubSignInButton callbackUrl={callbackUrl} />
                  </div>

                  <div className="mt-6 border-t border-border pt-4 text-sm text-muted lg:mt-auto">
                    登入後即可回到 PR 工作區，繼續目前操作。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
