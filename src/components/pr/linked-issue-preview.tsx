import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { ArrowUpRight } from "lucide-react";
import type { PullRequestLinkedIssue } from "@/types";

type LinkedIssuePreviewProps = {
  issue: PullRequestLinkedIssue;
};

export function LinkedIssuePreview({ issue }: LinkedIssuePreviewProps) {
  return (
    <div className="border-t border-border px-4 py-4">
      {(issue.labels?.length ?? 0) > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {issue.labels.map((label) => (
            <span
              key={label.name}
              className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{
                borderColor: `#${label.color}55`,
                backgroundColor: `#${label.color}1a`,
                color: `#${label.color}`,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-sm max-h-[320px] max-w-none overflow-auto rounded-2xl border border-border bg-card px-4 py-4 text-sm text-foreground">
        {issue.body.trim() ? (
          <ReactMarkdown rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
            {issue.body}
          </ReactMarkdown>
        ) : (
          <p className="text-muted">這筆 issue 目前沒有描述內容。</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={issue.htmlUrl}
          rel="noreferrer"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
        >
          在 GitHub 開啟
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
