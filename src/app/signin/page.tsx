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
    case "SessionRequired":
      return "請重新登入以繼續。";
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

  if (session && accessToken && !forceLogin && !errorMessage) {
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full flex-col overflow-hidden sm:min-h-[calc(100dvh-4rem)]">
        <Header variant="minimal" />

        <section className="flex flex-1 border-t border-border">
          <div className="mx-auto flex w-full max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
            <div className="grid w-full gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* content */}
              <div className="flex flex-col justify-center lg:col-span-7 lg:pr-8 xl:col-span-8 xl:pr-12">
                <div className="inline-flex w-fit items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                  <GitPullRequest className="h-3.5 w-3.5" />
                  <span>Pull Request Workspace</span>
                </div>

                <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-[2.9rem] sm:leading-tight">
                  更方便的處理 Pull Request
                </h1>

                <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">
                  連接 GitHub 後，你可以在儀表板集中查看 PR 與相關 Issue
                  的審查狀態，減少在多個頁面之間切換。
                </p>

                <div className="mt-8 grid max-w-2xl grid-cols-1 gap-x-6 sm:grid-cols-2">
                  {signInNotes.map((item, index) => {
                    const Icon = item.icon;
                    const isFirstRow = index < 2;

                    return (
                      <div
                        key={item.title}
                        className={[
                          "flex items-start gap-4 pt-4",
                          "sm:pt-4",
                          isFirstRow ? "sm:border-t-0 sm:pt-0" : "",
                          index === 0 ? "border-t-0 pt-0" : "",
                        ].join(" ")}
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
                <div className="flex w-full flex-col rounded-2xl border border-border bg-background p-5 sm:p-6 lg:ml-auto lg:h-full lg:max-w-md">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                      Sign In
                    </p>
                    <h2 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-foreground">
                      使用 GitHub 登入
                    </h2>
                    <p className="mt-2 text-sm text-muted">登入後即可進入 Pull Request 工作區</p>
                  </div>
                  <div className="mt-6 space-y-4 lg:mt-auto">
                    {errorMessage && (
                      <div className="border border-destructive/30 rounded-xl bg-destructive-soft px-4 py-3 text-sm text-foreground">
                        {errorMessage}
                      </div>
                    )}
                    <GithubSignInButton callbackUrl={callbackUrl} />
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
