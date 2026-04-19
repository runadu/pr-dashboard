"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDate, formatTime } from "@/utils/time";

type UseDateTimeOptions = {
  locale?: string;
  interval?: number;
};

type DateTimeState = {
  now: Date | null;
  dateText: string;
  timeText: string;
  isMorning: boolean;
  isAfternoon: boolean;
  isNight: boolean;
};

export function useDateTime(options: UseDateTimeOptions = {}): DateTimeState {
  const { locale = "zh-TW", interval = 60_000 } = options;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => {
      setNow(new Date());
    };

    update();
    const timer = window.setInterval(update, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [interval]);

  return useMemo(() => {
    if (!now) {
      return {
        now: null,
        dateText: "",
        timeText: "--:--",
        isMorning: false,
        isAfternoon: false,
        isNight: false,
      };
    }

    const hour = now.getHours();
    const isMorning = hour >= 6 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    const isNight = hour >= 18 || hour < 6;

    return {
      now,
      dateText: formatDate(now, locale),
      timeText: formatTime(now, locale),
      isMorning,
      isAfternoon,
      isNight,
    };
  }, [locale, now]);
}
