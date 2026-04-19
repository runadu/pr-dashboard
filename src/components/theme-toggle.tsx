"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  resolveThemePreference,
  SYSTEM_THEME_MEDIA_QUERY,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function readTheme(): Theme {
  return resolveThemePreference(
    localStorage.getItem(THEME_STORAGE_KEY),
    window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches
  );
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) callback();
  };

  const onMediaChange = () => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) callback();
  };

  const onThemeChange = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  media.addEventListener("change", onMediaChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    media.removeEventListener("change", onMediaChange);
  };
}

function getSnapshot(): Theme {
  return readTheme();
}

function getServerSnapshot(): Theme {
  return "dark";
}

function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <button
      aria-label={`切換成${isDark ? "淺色模式" : "深色模式"}`}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-foreground transition hover:border-accent/20 hover:bg-accent-soft"
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
