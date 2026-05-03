"use client";

import { useState, useSyncExternalStore } from "react";
import { SessionTimeoutWatcher } from "@/components/auth/session-timeout-watcher";
import { Sidebar } from "@/components/layout/sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
  sessionExpiresAt: string;
};

const SIDEBAR_COLLAPSED_STORAGE_KEY = "pr-dashboard.sidebar-collapsed";
const SIDEBAR_PREFERENCE_EVENT = "pr-dashboard:sidebar-preference-change";
const DEFAULT_SIDEBAR_COLLAPSED = true;

function readSidebarCollapsedPreference(): boolean {
  if (typeof window === "undefined") {
    return DEFAULT_SIDEBAR_COLLAPSED;
  }

  const storedPreference = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
  if (storedPreference === null) {
    return DEFAULT_SIDEBAR_COLLAPSED;
  }

  return storedPreference === "true";
}

function subscribeToSidebarPreference(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_COLLAPSED_STORAGE_KEY) {
      callback();
    }
  };

  const onPreferenceChange = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(SIDEBAR_PREFERENCE_EVENT, onPreferenceChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SIDEBAR_PREFERENCE_EVENT, onPreferenceChange);
  };
}

function getSidebarPreferenceSnapshot(): boolean {
  return readSidebarCollapsedPreference();
}

function getSidebarPreferenceServerSnapshot(): boolean {
  return DEFAULT_SIDEBAR_COLLAPSED;
}

function setSidebarCollapsedPreference(collapsed: boolean) {
  window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
  window.dispatchEvent(new Event(SIDEBAR_PREFERENCE_EVENT));
}

export function MainLayout({ children, sessionExpiresAt }: MainLayoutProps) {
  const collapsed = useSyncExternalStore(
    subscribeToSidebarPreference,
    getSidebarPreferenceSnapshot,
    getSidebarPreferenceServerSnapshot
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <SessionTimeoutWatcher expiresAt={sessionExpiresAt} />

      <div
        className={`grid bg-surface divide-y divide-border lg:divide-y-0 lg:divide-x lg:transition-all lg:duration-300 ${
          collapsed ? "lg:grid-cols-[72px_minmax(0,1fr)]" : "lg:grid-cols-[240px_minmax(0,1fr)]"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onDesktopToggle={() => setSidebarCollapsedPreference(!collapsed)}
          onMobileToggle={() => setMobileOpen((prev) => !prev)}
          onSelect={() => setMobileOpen(false)}
        />
        <main className="min-w-0 bg-surface px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </>
  );
}
