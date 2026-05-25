import type { PullRequestFile, PullRequestFileStatus } from "../../types/index";

export type DiffRenderState =
  | {
      kind: "viewer";
      oldValue: string;
      newValue: string;
      showDiffOnly: boolean;
      notice?: string;
    }
  | {
      kind: "message";
      title: string;
      body: string;
    };

export function parsePatch(patch: string): { oldCode: string; newCode: string } {
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

export function fileStatusLabel(status: PullRequestFileStatus) {
  return status === "added"
    ? "新增"
    : status === "removed"
      ? "刪除"
      : status === "renamed"
        ? "重新命名"
        : "修改";
}

export function fileStatusClasses(status: PullRequestFileStatus) {
  return status === "added"
    ? "bg-success-soft text-success"
    : status === "removed"
      ? "bg-destructive-soft text-destructive"
      : status === "renamed"
        ? "bg-warning-soft text-warning"
        : "bg-accent-soft text-accent";
}

export function getRenameSummary(file: PullRequestFile) {
  if (!file.previousFilename || file.previousFilename === file.filename) {
    return null;
  }

  return `從 ${file.previousFilename} 重新命名`;
}

export function getDiffRenderState(file: PullRequestFile): DiffRenderState {
  if (file.contentMode === "full") {
    return {
      kind: "viewer",
      oldValue: file.oldCode ?? "",
      newValue: file.newCode ?? "",
      showDiffOnly: true,
    };
  }

  if (file.contentMode === "patch" && file.patch) {
    const fallback = parsePatch(file.patch);
    return {
      kind: "viewer",
      oldValue: fallback.oldCode,
      newValue: fallback.newCode,
      showDiffOnly: false,
      notice: "目前顯示 GitHub 提供的 patch 節錄。未變更區塊無法像完整檔案 diff 一樣展開。",
    };
  }

  if (file.contentMode === "binary") {
    return {
      kind: "message",
      title: "Binary file",
      body: "這個檔案看起來是 binary 格式，無法在內嵌 diff 檢視器中顯示完整內容。",
    };
  }

  if (file.contentMode === "oversized") {
    return {
      kind: "message",
      title: "Diff too large",
      body: "這個檔案太大，已停用內嵌 diff 以避免 review 頁面效能明顯下降。",
    };
  }

  return {
    kind: "message",
    title: "Diff unavailable",
    body: "GitHub 沒有回傳可供內嵌顯示的完整內容。請前往 GitHub 查看原始檔案變更。",
  };
}
