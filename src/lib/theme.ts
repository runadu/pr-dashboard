export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "theme-change";
export const SYSTEM_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function resolveThemePreference(
  storedTheme: string | null,
  systemPrefersDark: boolean
): Theme {
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return systemPrefersDark ? "dark" : "light";
}

export function getThemeInitScript() {
  return `
    (() => {
      try {
        const storedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
        const systemTheme = window.matchMedia("${SYSTEM_THEME_MEDIA_QUERY}").matches;
        const theme = storedTheme === "light" || storedTheme === "dark"
          ? storedTheme
          : (systemTheme ? "dark" : "light");

        document.documentElement.dataset.theme = theme;
      } catch {}
    })();
  `;
}
