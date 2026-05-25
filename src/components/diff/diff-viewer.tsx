"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
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
  if (status === "added") return "新增";
  if (status === "removed") return "刪除";
  if (status === "renamed") return "更名";
  return "修改";
}

function fileStatusClasses(status: PullRequestFile["status"]) {
  return status === "added"
    ? "border-success/30 bg-success-soft text-success"
    : status === "removed"
      ? "border-destructive/20 bg-destructive-soft text-destructive"
      : "border-accent/30 bg-accent-soft text-accent";
}

export function DiffViewer({ files }: DiffViewerProps) {
  const [collapsedFiles, setCollapsedFiles] = useState<Record<string, boolean>>({});
  const allExpanded = files.every((file) => collapsedFiles[file.filename] === false);

  function toggleFile(filename: string) {
    setCollapsedFiles((current) => ({
      ...current,
      [filename]: !(current[filename] ?? true),
    }));
  }

  function expandAll() {
    setCollapsedFiles(
      Object.fromEntries(files.map((file) => [file.filename, false])) as Record<string, boolean>
    );
  }

  function collapseAll() {
    setCollapsedFiles(
      Object.fromEntries(files.map((file) => [file.filename, true])) as Record<string, boolean>
    );
  }

  function unavailableMessage(file: PullRequestFile) {
    if (file.contentMode === "binary") return "Binary file 無法顯示文字 diff。";
    if (file.contentMode === "oversized") return "檔案過大，已略過 diff 預覽。";
    if (file.contentMode === "unavailable") return "GitHub 未提供此檔案的可顯示內容。";
    return "無法顯示此檔案的 diff。";
  }

  if (files.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">程式碼變更</p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Diff 檢視區
          </h2>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted">
          這個 PR 沒有檔案變更。
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Code Changes
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Diff 檢視區
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            <span>{files.length}</span>
            <span className="ml-2">個檔案</span>
          </div>
          <button
            type="button"
            onClick={allExpanded ? collapseAll : expandAll}
            className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/30 hover:text-accent"
          >
            {allExpanded ? "全部收合" : "全部展開"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
        {files.map((file) => {
          const fallback = parsePatch(file.patch ?? "");
          const oldCode = file.oldCode ?? fallback.oldCode;
          const newCode = file.newCode ?? fallback.newCode;
          const isCollapsed = collapsedFiles[file.filename] ?? true;
          const canRenderDiff =
            (file.contentMode === "full" || file.contentMode === "patch") &&
            (Boolean(oldCode) || Boolean(newCode) || Boolean(file.patch));

          return (
            <article
              key={file.filename}
              className="min-w-0 overflow-hidden rounded-xl border border-border bg-background"
            >
              <header
                className={[
                  isCollapsed ? "" : "border-b border-border",
                  "flex flex-col gap-3 bg-surface px-3 py-3 sm:px-4",
                ].join(" ")}
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => toggleFile(file.filename)}
                      aria-expanded={!isCollapsed}
                      aria-label={isCollapsed ? `展開 ${file.filename}` : `收合 ${file.filename}`}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background p-1.5 text-xs font-semibold text-foreground transition hover:bg-surface hover:cursor-pointer"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${fileStatusClasses(file.status)}`}
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

              {isCollapsed ? null : canRenderDiff ? (
                <div className="max-w-full overflow-x-auto overscroll-x-contain bg-card">
                  <div className="min-w-0">
                    <ReactDiffViewer
                      oldValue={oldCode}
                      newValue={newCode}
                      splitView={false}
                      compareMethod={DiffMethod.LINES}
                      showDiffOnly={true}
                      hideSummary={true}
                      useDarkTheme={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-muted">{unavailableMessage(file)}</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
