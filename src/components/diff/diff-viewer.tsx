"use client";

import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import type { PullRequestFile } from "@/types/index";

type DiffViewerProps = {
  files: PullRequestFile[];
};

function parsePatch(patch: string): { oldCode: string; newCode: string } {
  const lines = patch.split("\n");
  const oldLines: string[] = [];
  const newLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("@@")) continue;

    if (line.startsWith("-")) {
      oldLines.push(line.slice(1));
    } else if (line.startsWith("+")) {
      newLines.push(line.slice(1));
    } else {
      oldLines.push(line);
      newLines.push(line);
    }
  }

  return {
    oldCode: oldLines.join("\n"),
    newCode: newLines.join("\n"),
  };
}

function fileStatusLabel(status: PullRequestFile["status"]) {
  return status === "added" ? "新增" : status === "removed" ? "刪除" : "修改";
}

function fileStatusClasses(status: PullRequestFile["status"]) {
  return status === "added"
    ? "bg-success-soft text-success"
    : status === "removed"
      ? "bg-destructive-soft text-destructive"
      : "bg-accent-soft text-accent";
}

export function DiffViewer({ files }: DiffViewerProps) {
  if (files.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">程式碼變更</p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Diff 檢視區
          </h2>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted">
          這個 PR 沒有檔案變更。
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">程式碼變更</p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Diff 檢視區
          </h2>
          <p className="text-sm leading-6 text-muted">檢查每個檔案的變更內容與增減行數。</p>
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          <span>{files.length}</span>
          <span className="ml-2">個檔案</span>
        </div>
      </div>

      <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
        {files.map((file) => {
          const { oldCode, newCode } = parsePatch(file.patch ?? "");

          return (
            <article
              key={file.filename}
              className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background"
            >
              <header className="flex flex-col gap-3 border-b border-border bg-surface px-3 py-3 sm:px-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${fileStatusClasses(file.status)}`}
                    >
                      {fileStatusLabel(file.status)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate font-mono text-[12px] font-medium leading-5 text-foreground sm:text-sm"
                        title={file.filename}
                      >
                        {file.filename}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-start whitespace-nowrap pl-0 text-xs font-semibold sm:pl-3">
                    <span className="rounded-full bg-success-soft px-2.5 py-1 text-success">
                      +{file.additions}
                    </span>
                    <span className="rounded-full bg-destructive-soft px-2.5 py-1 text-destructive">
                      -{file.deletions}
                    </span>
                  </div>
                </div>
              </header>

              {file.patch ? (
                <div className="max-w-full overflow-x-auto overscroll-x-contain bg-card">
                  <div className="min-w-0">
                    <ReactDiffViewer
                      oldValue={oldCode}
                      newValue={newCode}
                      splitView={false}
                      compareMethod={DiffMethod.LINES}
                      leftTitle={file.filename}
                      useDarkTheme={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-muted">無法顯示此檔案的 diff。</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
