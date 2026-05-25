"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { MessageSquareText } from "lucide-react";
import { StatusBadge as BaseStatusBadge } from "@/components/ui/status-badge";

type Comment = {
  id: string;
  kind?: "comment" | "review" | "review_comment";
  author: string;
  avatarUrl?: string | null;
  body: string;
  createdAt: string;
  state?: string;
  path?: string;
  htmlUrl?: string;
};

type CommentBoxProps = {
  eyebrow?: string;
  title?: string;
  emptyMessage?: string;
  loadingMessage?: string;
};

type CommentAvatarProps = {
  author: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
};

function formatCommentTime(value: string) {
  return new Date(value).toLocaleString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function commentKindLabel(comment: Comment) {
  if (comment.kind === "review_comment") {
    return "程式碼回覆";
  }

  if (comment.kind === "review") {
    const state = comment.state?.toUpperCase();
    if (state === "APPROVED") return "Approved";
    if (state === "CHANGES_REQUESTED") return "Changes requested";
    if (state === "DISMISSED") return "Review dismissed";
    return "Review";
  }

  return "留言";
}

function commentKindTone(comment: Comment): "accent" | "success" | "neutral" {
  if (comment.kind === "review") {
    return comment.state?.toUpperCase() === "APPROVED" ? "success" : "accent";
  }

  if (comment.kind === "review_comment") return "accent";

  return "neutral";
}

function CommentAvatar({ author, avatarUrl, size = "md" }: CommentAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initial = author?.trim()?.charAt(0).toUpperCase() || "?";
  const showAvatar = Boolean(avatarUrl) && !imgError;
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const imageSize = size === "sm" ? 32 : 36;

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-strong`}
    >
      {showAvatar ? (
        <Image
          src={avatarUrl!}
          alt={`${author} avatar`}
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-semibold text-foreground">{initial}</span>
      )}
    </span>
  );
}

export function CommentBox({
  eyebrow = "Review thread",
  title = "Conversation",
  emptyMessage = "目前沒有留言或 review。",
  loadingMessage = "Loading comments...",
}: CommentBoxProps = {}) {
  const { owner, repo, number } = useParams<{
    owner: string;
    repo: string;
    number: string;
  }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /*
  Re-enable writable comments later:
  - Restore composer state: body, isPreview, isSubmitting
  - Restore textareaRef and Markdown toolbar helpers
  - POST to /api/comment with:
      { owner, repo, number: Number(number), body }
  - Append data.comment to comments after a successful submit
  */

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comment?owner=${owner}&repo=${repo}&number=${number}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setComments(data.comments);
      } catch {
        setErrorMessage("Failed to load comments.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [owner, repo, number]);

  return (
    <aside className="rounded-xl border border-border bg-card">
      <div className="px-4 py-4 sm:px-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {eyebrow}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {!isLoading && comments.length > 0 ? (
                <span className="text-sm font-medium text-muted-foreground">
                  {comments.length} 則對話
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <section className="space-y-3">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-background px-4 py-5 text-sm text-muted">
              {loadingMessage}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted">
              {emptyMessage}
            </div>
          ) : (
            <ul className="relative space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="relative flex gap-3">
                  <div className="relative z-10">
                    <CommentAvatar
                      author={comment.author}
                      avatarUrl={comment.avatarUrl}
                      size="sm"
                    />
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background shadow-xs">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-background px-2.5 py-1 text-sm font-semibold text-foreground">
                        <MessageSquareText className="h-3.5 w-3.5 text-accent" />
                        {comment.author}
                      </span>
                      <BaseStatusBadge
                        label={commentKindLabel(comment)}
                        tone={commentKindTone(comment)}
                      />
                      {comment.kind === "review_comment" && comment.path ? (
                        <span
                          className="inline-flex max-w-full items-center truncate rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted"
                          title={comment.path}
                        >
                          {comment.path}
                        </span>
                      ) : null}
                      <span className="text-xs text-muted">
                        {formatCommentTime(comment.createdAt)}
                      </span>
                    </div>

                    <div className="prose prose-sm max-w-none px-4 py-4 text-sm leading-7 text-foreground">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
                        {comment.body}
                      </ReactMarkdown>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {errorMessage && (
          <div className="rounded-xl border border-destructive/20 bg-destructive-soft px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
    </aside>
  );
}
