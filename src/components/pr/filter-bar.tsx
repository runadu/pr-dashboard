"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { TRIAGE_QUEUE_OPTIONS } from "@/lib/triage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFilter,
  selectQueueCounts,
  resetFilters,
  setQueue,
  setSearchQuery,
} from "@/store/filter-slice";

export function FilterBar() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const queueCounts = useAppSelector(selectQueueCounts);
  const allCount = Object.values(queueCounts).reduce((sum, count) => sum + count, 0);
  const hasActive = filter.queue !== "all" || filter.searchQuery.trim() !== "";

  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              快速切換待處理清單
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRIAGE_QUEUE_OPTIONS.map((option) => {
            const active = filter.queue === option.value;
            const count = option.value === "all" ? allCount : queueCounts[option.value];

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => dispatch(setQueue(option.value))}
                className={`group inline-flex items-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                  active
                    ? "border-accent bg-accent shadow-lg shadow-black/5"
                    : "border-border bg-card hover:border-accent/30 hover:bg-surface-strong hover:shadow-lg hover:shadow-black/5 hover:text-accent"
                }`}
              >
                <span className={active ? "text-accent-foreground" : "text-foreground"}>
                  {option.label}
                </span>

                <span
                  className={`ml-2 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                    active ? "bg-black/10 text-accent-foreground" : "bg-background text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={filter.searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="搜尋 PR、author 或 repo..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {hasActive && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-[color:var(--accent-subtle-border)] hover:bg-accent-muted"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
