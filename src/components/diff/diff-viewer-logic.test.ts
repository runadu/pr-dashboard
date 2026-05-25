import { describe, expect, it } from "vitest";
import { getDiffRenderState, getRenameSummary, parsePatch } from "./diff-viewer-logic";
import type { PullRequestFile } from "../../types/index";

function makeFile(overrides: Partial<PullRequestFile> = {}): PullRequestFile {
  return {
    filename: "src/app/page.tsx",
    previousFilename: null,
    additions: 3,
    deletions: 1,
    patch: "@@ -1,2 +1,2 @@\n-old\n+new",
    status: "modified",
    oldCode: "old",
    newCode: "new",
    contentMode: "full",
    ...overrides,
  };
}

describe("diff-viewer-logic", () => {
  it("converts GitHub patch lines into old/new text", () => {
    expect(parsePatch("@@ -1,2 +1,2 @@\n keep\n-old\n+new")).toEqual({
      oldCode: " keep\nold",
      newCode: " keep\nnew",
    });
  });

  it("uses full-content files for foldable unchanged sections", () => {
    const state = getDiffRenderState(makeFile());

    expect(state.kind).toBe("viewer");
    if (state.kind !== "viewer") return;
    expect(state.oldValue).toBe("old");
    expect(state.newValue).toBe("new");
    expect(state.showDiffOnly).toBe(true);
  });

  it("keeps patch-only files viewable but disables full-text fold expectations", () => {
    const state = getDiffRenderState(
      makeFile({
        oldCode: null,
        newCode: null,
        contentMode: "patch",
      })
    );

    expect(state.kind).toBe("viewer");
    if (state.kind !== "viewer") return;
    expect(state.showDiffOnly).toBe(false);
    expect(state.notice ?? "").toMatch(/patch/);
  });

  it("renders an explicit fallback message for binary files", () => {
    const state = getDiffRenderState(
      makeFile({
        patch: "",
        oldCode: null,
        newCode: null,
        contentMode: "binary",
      })
    );

    expect(state.kind).toBe("message");
    if (state.kind !== "message") return;
    expect(state.title).toMatch(/Binary/);
  });

  it("renders a performance-oriented fallback message for oversized files", () => {
    const state = getDiffRenderState(
      makeFile({
        patch: "",
        oldCode: null,
        newCode: null,
        contentMode: "oversized",
      })
    );

    expect(state.kind).toBe("message");
    if (state.kind !== "message") return;
    expect(state.body).toMatch(/效能/);
  });

  it("exposes a rename summary for renamed files", () => {
    expect(
      getRenameSummary(
        makeFile({
          status: "renamed",
          previousFilename: "src/app/old-page.tsx",
        })
      )
    ).toBe("從 src/app/old-page.tsx 重新命名");
  });
});
