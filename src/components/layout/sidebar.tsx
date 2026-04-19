"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, LayoutDashboard, Menu, X } from "lucide-react";

const workspaceItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
] as const;

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDesktopToggle: () => void;
  onMobileToggle: () => void;
  onSelect: () => void;
};

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  meta?: string;
  href?: string;
  onClick: () => void;
};

function SidebarItem({
  icon: Icon,
  label,
  isActive,
  collapsed,
  meta,
  href,
  onClick,
}: SidebarItemProps) {
  const className = [
    "group relative w-full rounded-xl transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
    collapsed
      ? "flex items-center mx-auto gap-3 px-3 py-2.5 lg:h-12 lg:w-12 lg:justify-center lg:px-0"
      : "flex items-center gap-3 px-3 py-2.5 lg:px-1",
    isActive
      ? "bg-surface-strong text-foreground"
      : "text-muted hover:bg-surface-strong hover:text-foreground",
  ].join(" ");

  const content = (
    <>
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
          isActive
            ? "bg-accent-soft text-accent"
            : "text-muted group-hover:bg-surface group-hover:text-foreground",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <span
        className={
          collapsed ? "truncate text-sm font-medium lg:hidden" : "truncate text-sm font-medium"
        }
      >
        {label}
      </span>
      {meta && (
        <span
          className={
            collapsed ? "ml-auto text-xs text-muted lg:hidden" : "ml-auto text-xs text-muted"
          }
        >
          {meta}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        className={className}
        href={href}
        onClick={onClick}
        title={collapsed ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={className}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      {content}
    </button>
  );
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onDesktopToggle,
  onMobileToggle,
  onSelect,
}: SidebarProps) {
  const pathname = usePathname();
  const isWorkspaceActive = (href: string) => {
    if (href === "/dashboard") return pathname === href || pathname.startsWith("/pr/");
    return pathname === href;
  };

  return (
    <aside
      className={["relative bg-surface", collapsed ? "p-3 lg:px-2 lg:py-3" : "p-4 lg:p-5"].join(
        " "
      )}
    >
      <div className="flex h-full min-h-full flex-col">
        <div
          className={[
            "flex items-center",
            collapsed ? "justify-between lg:justify-center" : "justify-between",
          ].join(" ")}
        >
          <div
            className={[
              "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out",
              collapsed ? "max-w-full opacity-100 lg:max-w-0 lg:opacity-0" : "opacity-100",
            ].join(" ")}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Navigation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDesktopToggle}
              className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:text-foreground lg:flex"
              aria-label={collapsed ? "展開側邊欄" : "收合側邊欄"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onMobileToggle}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:text-foreground lg:hidden"
              aria-label={mobileOpen ? "關閉導覽選單" : "開啟導覽選單"}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav
          className={[
            "mt-5",
            mobileOpen ? "block" : "hidden",
            collapsed ? "lg:block" : "lg:flex-1 lg:block",
          ].join(" ")}
          aria-label="Workspace 導覽"
        >
          <div className="space-y-1.5">
            {workspaceItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                isActive={isWorkspaceActive(item.href)}
                href={item.href}
                onClick={onSelect}
              />
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
