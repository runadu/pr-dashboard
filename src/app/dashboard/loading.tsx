export default function PullRequestLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto overflow-hidden border border-border/50 bg-surface/90 divide-y divide-border/60">
        <header className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="h-6 w-44 animate-pulse rounded-md bg-accent-soft" />
            <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-md bg-surface-strong/60" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-accent-soft" />
            <div className="hidden sm:block">
              <div className="h-4 w-28 animate-pulse rounded-md bg-surface-strong/60" />
              <div className="mt-2 h-3 w-36 animate-pulse rounded-md bg-accent-soft" />
            </div>
          </div>
        </header>

        <main className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-[72px_1fr]">
          <aside className="border-b border-border/60 bg-background/20 p-3 lg:border-b-0 lg:border-r lg:border-r-border/60 lg:px-2 lg:py-3">
            <div className="flex h-full min-h-full flex-col">
              <div className="flex min-h-10 items-center justify-between lg:justify-center">
                <div className="h-10 w-10 animate-pulse rounded-2xl border border-border/70 bg-surface-strong" />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-center rounded-xl bg-surface-strong px-2 py-2.5 lg:h-12">
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-accent-soft" />
                </div>
              </div>
            </div>
          </aside>

          <section className="p-4 sm:p-6">
            <div className="mb-5 rounded-md border border-border/60 bg-surface/45 p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <div className="h-5 w-28 animate-pulse rounded-full bg-accent-soft" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-accent-muted" />
                  </div>

                  <div className="h-7 w-11/12 animate-pulse rounded-md bg-surface-strong/70 sm:w-3/4" />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-background/50" />
                    <div className="h-5 w-36 animate-pulse rounded-full bg-background/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:w-44">
                  <div className="rounded-md border border-border/70 bg-background/30 p-3">
                    <div className="h-3 w-16 animate-pulse rounded-md bg-accent-soft" />
                    <div className="mt-3 h-6 w-6 animate-pulse rounded-md bg-surface-strong/70" />
                  </div>

                  <div className="rounded-md border border-border/70 bg-background/30 p-3">
                    <div className="h-3 w-14 animate-pulse rounded-md bg-accent-soft" />
                    <div className="mt-3 h-6 w-6 animate-pulse rounded-md bg-surface-strong/70" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 overflow-hidden rounded-md border border-border/60 bg-surface/45">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div>
                  <div className="h-4 w-32 animate-pulse rounded-md bg-surface-strong/70" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-accent-soft" />
                </div>

                <div className="h-7 w-7 animate-pulse rounded-md bg-background/50" />
              </div>

              <div className="p-4">
                <div className="rounded-md border border-border/60 bg-background/20 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-accent-soft" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-44 animate-pulse rounded-md bg-surface-strong/70" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-accent-soft" />
                    </div>
                  </div>

                  <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-surface/80" />
                </div>

                <div className="mt-4 rounded-md border border-border/60 bg-background/20">
                  <div className="border-b border-border/60 px-4 py-3">
                    <div className="h-4 w-28 animate-pulse rounded-md bg-surface-strong/70" />
                  </div>

                  <div className="p-4">
                    <div className="h-28 animate-pulse rounded-md bg-surface/80" />

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="h-3 w-20 animate-pulse rounded-md bg-accent-soft" />
                        <div className="h-3 w-24 animate-pulse rounded-md bg-accent-soft" />
                      </div>

                      <div className="h-8 w-20 animate-pulse rounded-md bg-accent-soft" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 overflow-hidden rounded-md border border-border/60 bg-surface/45">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded-md bg-surface-strong/70" />
                  <div className="mt-2 h-3 w-20 animate-pulse rounded-md bg-accent-soft" />
                </div>

                <div className="h-4 w-10 animate-pulse rounded-md bg-surface-strong/50" />
              </div>

              <div className="p-4">
                <div className="rounded-md border border-border/60 bg-background/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-accent-soft" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-surface-strong/70" />
                        <div className="h-5 w-14 animate-pulse rounded-full bg-accent-soft" />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="h-5 w-16 animate-pulse rounded-full bg-surface/80" />
                        <div className="h-5 w-28 animate-pulse rounded-full bg-surface/80" />
                        <div className="h-5 w-20 animate-pulse rounded-full bg-surface/80" />
                      </div>

                      <div className="mt-4 h-10 w-full animate-pulse rounded-md bg-surface/80" />

                      <div className="mt-3 h-7 w-24 animate-pulse rounded-md bg-background/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-border/60 bg-surface/45">
              <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="h-5 w-28 animate-pulse rounded-md bg-surface-strong/70" />
                  <div className="mt-2 h-3 w-48 animate-pulse rounded-md bg-accent-soft" />
                </div>

                <div className="h-4 w-16 animate-pulse rounded-md bg-surface-strong/50" />
              </div>

              <div className="space-y-4 p-4">
                {Array.from({ length: 2 }).map((_, fileIndex) => (
                  <div
                    key={fileIndex}
                    className="overflow-hidden rounded-md border border-border/60 bg-background/20"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-5 w-10 animate-pulse rounded-full bg-accent-soft" />
                        <div className="h-4 w-72 max-w-[60vw] animate-pulse rounded-md bg-surface-strong/70" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-5 w-10 animate-pulse rounded-full bg-accent-soft" />
                        <div className="h-5 w-6 animate-pulse rounded-full bg-surface-strong/50" />
                      </div>
                    </div>

                    <div className="bg-background/40">
                      {Array.from({ length: fileIndex === 0 ? 28 : 14 }).map((_, lineIndex) => {
                        const isRemoved = lineIndex === 6 || lineIndex === 18;
                        const isAdded = !isRemoved && lineIndex % 4 !== 0;

                        return (
                          <div
                            key={lineIndex}
                            className={[
                              "grid grid-cols-[3rem_1fr] border-b border-border/30 text-xs",
                              isRemoved
                                ? "bg-red-500/10"
                                : isAdded
                                  ? "bg-emerald-500/10"
                                  : "bg-background/40",
                            ].join(" ")}
                          >
                            <div className="border-r border-border/40 px-2 py-1.5 text-right">
                              <div className="ml-auto h-3 w-5 animate-pulse rounded-sm bg-surface-strong/40" />
                            </div>

                            <div className="px-3 py-1.5">
                              <div
                                className={[
                                  "h-3 animate-pulse rounded-sm",
                                  lineIndex % 5 === 0
                                    ? "w-5/12"
                                    : lineIndex % 3 === 0
                                      ? "w-9/12"
                                      : "w-7/12",
                                  isRemoved
                                    ? "bg-red-500/20"
                                    : isAdded
                                      ? "bg-emerald-500/20"
                                      : "bg-surface-strong/40",
                                ].join(" ")}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              正在載入 Pull Request 詳細資料與檔案差異。
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
