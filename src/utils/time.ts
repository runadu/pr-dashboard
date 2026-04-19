export function formatTime(date: Date, locale = "zh-TW") {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: Date, locale = "zh-TW") {
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
