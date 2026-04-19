"use client";

import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

type DiffViewerClientProps = {
  oldCode: string;
  newCode: string;
  filename: string;
};

export function DiffViewerClient({ oldCode, newCode, filename }: DiffViewerClientProps) {
  return (
    <ReactDiffViewer
      oldValue={oldCode}
      newValue={newCode}
      splitView={false}
      compareMethod={DiffMethod.LINES}
      leftTitle={filename}
      useDarkTheme={false}
    />
  );
}
