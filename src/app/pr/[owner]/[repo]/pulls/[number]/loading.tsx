export default function PullRequestLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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

          <section className="min-w-0 bg-surface px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-5">
              <section className="rounded-2xl border border-border/60 bg-surface/45 px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-5">
                  <div className="h-4 w-28 animate-pulse rounded-md bg-accent-soft" />

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <div className="h-7 w-40 animate-pulse rounded-full bg-background/50" />
                        <div className="h-7 w-20 animate-pulse rounded-full bg-accent-soft" />
                      </div>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <div className="h-9 w-11/12 max-w-2xl animate-pulse rounded-md bg-surface-strong/70" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-accent-soft" />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="h-8 w-28 animate-pulse rounded-full bg-background/50" />
                        <div className="h-8 w-44 animate-pulse rounded-full bg-background/50" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:w-fit xl:min-w-65">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-border bg-background px-4 py-3"
                        >
                          <div className="h-3 w-16 animate-pulse rounded-md bg-accent-soft" />
                          <div className="mt-3 h-7 w-12 animate-pulse rounded-md bg-surface-strong/70" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-5">
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80">
                  <div className="border-b border-border/60 px-4 py-4 sm:px-5">
                    <div className="space-y-2">
                      <div className="h-3 w-24 animate-pulse rounded-md bg-accent-soft" />
                      <div className="h-5 w-32 animate-pulse rounded-md bg-surface-strong/70" />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-accent-soft" />

                          <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border/60 bg-background/80">
                            <div className="border-b border-border/60 bg-surface/80 px-4 py-2.5">
                              <div className="h-4 w-44 animate-pulse rounded-md bg-surface-strong/70" />
                            </div>

                            <div className="px-4 py-4">
                              <div className="h-4 w-full animate-pulse rounded-md bg-accent-soft" />
                              <div className="mt-2 h-4 w-10/12 animate-pulse rounded-md bg-accent-soft" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-accent-soft" />

                      <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border/60 bg-background/80">
                        <div className="border-b border-border/60 bg-surface/80 px-3 py-2">
                          <div className="flex gap-2">
                            <div className="h-7 w-14 animate-pulse rounded-md bg-surface-strong/60" />
                            <div className="h-7 w-16 animate-pulse rounded-md bg-accent-soft" />
                          </div>
                        </div>

                        <div className="px-4 py-4">
                          <div className="h-36 animate-pulse rounded-md bg-surface/80" />
                        </div>

                        <div className="border-t border-border/60 bg-surface/40 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="h-3 w-40 animate-pulse rounded-md bg-accent-soft" />
                            <div className="h-9 w-24 animate-pulse rounded-md bg-accent-soft" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-5">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="h-3 w-24 animate-pulse rounded-md bg-accent-soft" />
                        <div className="mt-2 h-5 w-28 animate-pulse rounded-md bg-surface-strong/70" />
                      </div>
                      <div className="h-4 w-10 animate-pulse rounded-md bg-surface-strong/50" />
                    </div>

                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-2xl border border-border/60 bg-background/80"
                        >
                          <div className="px-4 py-4">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 shrink-0 animate-pulse rounded-2xl bg-accent-soft" />

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap gap-2">
                                  <div className="h-6 w-36 animate-pulse rounded-full bg-background/60" />
                                  <div className="h-6 w-14 animate-pulse rounded-full bg-accent-soft" />
                                </div>

                                <div className="mt-3 h-6 w-3/5 animate-pulse rounded-md bg-surface-strong/70" />

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <div className="h-6 w-20 animate-pulse rounded-full bg-background/60" />
                                  <div className="h-6 w-24 animate-pulse rounded-full bg-background/60" />
                                  <div className="h-6 w-16 animate-pulse rounded-full bg-background/60" />
                                </div>
                              </div>

                              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-surface-strong/60" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
