"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, Smile } from "lucide-react";

type UserMenuProps = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  className?: string;
};

export function UserMenu({ name, email, avatarUrl, className }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showAvatar = Boolean(avatarUrl) && !imgError;
  const displayName = name?.trim() || "GitHub User";
  const displayEmail = email?.trim() || "已連線 GitHub";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={`relative w-full sm:w-auto ${className ?? ""}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-12 w-full items-center gap-3 rounded-2xl border border-border bg-surface px-2 transition hover:border-accent/20 hover:bg-accent-soft sm:w-auto"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-strong">
          {showAvatar ? (
            <Image
              src={avatarUrl!}
              alt="User avatar"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {initial || <Smile className="h-5 w-5 text-foreground" />}
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1 text-left sm:max-w-[180px]">
          <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
          <span className="block truncate text-xs text-muted">{displayEmail}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-full rounded-2xl border border-border bg-surface-strong p-2 shadow-sm sm:w-[180px]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            登出
          </button>
        </div>
      )}
    </div>
  );
}
