type StatusBadgeTone = "accent" | "success" | "neutral";

type StatusBadgeProps = {
  label: string;
  tone: StatusBadgeTone;
};

const toneClasses: Record<StatusBadgeTone, string> = {
  accent: "border-accent/30 bg-accent-soft text-accent",
  success: "border-success/30 bg-success-soft text-success",
  neutral: "border-border bg-surface text-muted-foreground",
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        toneClasses[tone],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
