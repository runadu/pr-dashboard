"use client";

import type { ReactNode } from "react";
import { ShieldAlert, ShieldCheck, Sparkles, TriangleAlert, UserRoundPen } from "lucide-react";
import {
  TRIAGE_QUEUE_DESCRIPTIONS,
  TRIAGE_QUEUE_LABELS,
  type TriageQueueCountMap,
} from "@/lib/triage";
import { useAppSelector } from "@/store/hooks";
import { selectQueueCounts } from "@/store/filter-slice";
import { selectPRHasLoaded } from "@/store/pr-slice";

type DashboardStatsProps = {
  initialQueueCounts: TriageQueueCountMap;
};

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border px-4 py-4 transition-colors sm:px-5 border-border bg-card hover:bg-surface-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted">{label}</p>
          <div className={["mt-2 tracking-tight text-foreground text-2xl font-semibold"].join(" ")}>
            {value}
          </div>
        </div>

        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

const TRIAGE_STAT_CARDS = [
  {
    queue: "needs-review",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
  {
    queue: "waiting-on-author",
    icon: <UserRoundPen className="h-4 w-4" />,
  },
  {
    queue: "merge-blocked",
    icon: <TriangleAlert className="h-4 w-4" />,
  },
  {
    queue: "ready-to-merge",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
] as const;

export function DashboardStats({ initialQueueCounts }: DashboardStatsProps) {
  const hasLoadedPRs = useAppSelector(selectPRHasLoaded);
  const liveQueueCounts = useAppSelector(selectQueueCounts);

  const displayQueueCounts = hasLoadedPRs ? liveQueueCounts : initialQueueCounts;

  return (
    <section className="">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cross-repo triage queue</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TRIAGE_STAT_CARDS.map((card) => (
          <StatCard
            key={card.queue}
            icon={card.icon}
            label={TRIAGE_QUEUE_LABELS[card.queue]}
            value={displayQueueCounts[card.queue]}
            description={TRIAGE_QUEUE_DESCRIPTIONS[card.queue]}
          />
        ))}
      </div>
    </section>
  );
}
