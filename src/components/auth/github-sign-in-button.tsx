"use client";

import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

type GithubSignInButtonProps = {
  callbackUrl: string;
};

function GithubMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.78.4.08.55-.18.55-.39 0-.19-.01-.84-.01-1.52-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.16-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.84.72 1.25 1.87.9 2.33.68.07-.54.28-.9.5-1.11-1.78-.21-3.64-.92-3.64-4.08 0-.9.31-1.64.82-2.22-.08-.21-.36-1.05.08-2.18 0 0 .67-.22 2.2.85a7.32 7.32 0 0 1 4 0c1.53-1.07 2.2-.85 2.2-.85.44 1.13.16 1.97.08 2.18.51.58.82 1.31.82 2.22 0 3.17-1.87 3.87-3.65 4.08.29.25.54.73.54 1.49 0 1.07-.01 1.94-.01 2.21 0 .21.15.47.55.39A8.12 8.12 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
    </svg>
  );
}

export function GithubSignInButton({ callbackUrl }: GithubSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          void signIn("github", { callbackUrl });
        });
      }}
      disabled={isPending}
      className="
    inline-flex w-full items-center justify-center gap-3
    rounded-xl
    bg-[#24292f]
    px-5 py-3.5
    text-white
    font-semibold
    transition
    hover:bg-[#30363d]
    active:bg-[#1f2328]
    disabled:bg-[#57606a]
    disabled:text-white/70
  "
    >
      {isPending ? (
        <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-inherit" />
      ) : (
        <GithubMark className="h-5 w-5 shrink-0 text-white" />
      )}
      <span className="leading-none text-white">
        {isPending ? "正在連接 GitHub..." : "使用 GitHub 登入"}
      </span>
    </button>
  );
}
