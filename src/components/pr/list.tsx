"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPRList } from "@/store/pr-slice";
import { resetFilters, selectFilter, selectFilteredPRs } from "@/store/filter-slice";
import { Card } from "@/components/pr/card";
import { Inbox, RotateCcw } from "lucide-react";
import type { PullRequest } from "@/types";

type ListProps = {
  initialPRs: PullRequest[];
};

export function List({ initialPRs }: ListProps) {
  const dispatch = useAppDispatch();
  const filteredPRs = useAppSelector(selectFilteredPRs);
  const filter = useAppSelector(selectFilter);
  const hasActiveFilters = filter.queue !== "all" || filter.searchQuery !== "";

  useEffect(() => {
    dispatch(setPRList(initialPRs));
  }, [dispatch, initialPRs]);

  if (filteredPRs.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-borders">
        <div>
          <div className="mx-auto flex max-w-md flex-col items-center p-4 lg:p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Inbox className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-semibold tracking-tight text-muted-foreground">
              沒有符合條件的 Pull Request
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => dispatch(resetFilters())}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-border bg-surface-strong px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-soft hover:text-accent"
              >
                <RotateCcw className="h-4 w-4" />
                <span>清除篩選</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4">
        {filteredPRs.map((pr) => (
          <Card key={pr.id} pullRequest={pr} />
        ))}
      </div>
    </section>
  );
}
