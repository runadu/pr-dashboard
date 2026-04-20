"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

type Comment = {
  id: number;
  author: string;
  avatarUrl?: string | null;
  body: string;
  createdAt: string;
};

type CommentBoxProps = {
  eyebrow?: string;
  title?: string;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  submitLabel?: string;
  currentUserName?: string;
  currentUserAvatarUrl?: string | null;
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

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-transparent px-2 text-xs font-medium text-muted transition hover:border-border hover:bg-surface hover:text-foreground"
    >
      {label}
    </button>
  );
}

export function CommentBox({
  eyebrow = "Review",
  title = "Discussion",
  placeholder = "Leave a comment",
  emptyMessage = "No comments yet.",
  loadingMessage = "Loading comments...",
  submitLabel = "Comment",
  currentUserName = "You",
  currentUserAvatarUrl = null,
}: CommentBoxProps = {}) {
  const { owner, repo, number } = useParams<{
    owner: string;
    repo: string;
    number: string;
  }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSubmit = useCallback(async () => {
    if (!body.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, number: Number(number), body }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setBody("");
      setIsPreview(false);
    } catch {
      setErrorMessage("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [body, number, owner, repo]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (body.trim() && !isSubmitting) {
          handleSubmit();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [body, handleSubmit, isSubmitting]);

  function insertMarkdown(syntax: string, wrap = false) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.slice(start, end);

    const inserted = wrap
      ? `${syntax}${selected || "text"}${syntax}`
      : `${syntax}${selected || "text"}`;

    const next = body.slice(0, start) + inserted + body.slice(end);
    setBody(next);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + syntax.length,
        start + syntax.length + (selected || "text").length
      );
    }, 0);
  }

  return (
    <aside className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
          <div className="flex items-center justify-between gap-3">
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
            {!isLoading && comments.length > 0 && (
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted">
                {comments.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <section className="space-y-3">
          {isLoading ? (
            <div className="rounded-md border border-border bg-background px-4 py-5 text-sm text-muted">
              {loadingMessage}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-background px-4 py-5 text-sm text-muted">
              {emptyMessage}
            </div>
          ) : (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="flex gap-3">
                  <CommentAvatar author={comment.author} avatarUrl={comment.avatarUrl} size="sm" />

                  <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border bg-background">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border bg-surface px-4 py-2.5">
                      <span className="text-sm font-semibold text-foreground">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted">commented</span>
                      <span className="text-xs text-muted">
                        {formatCommentTime(comment.createdAt)}
                      </span>
                    </div>

                    <div className="prose prose-sm max-w-none px-4 py-4 text-sm text-foreground">
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

        <section className="flex gap-3">
          <CommentAvatar author={currentUserName} avatarUrl={currentUserAvatarUrl} size="md" />

          <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  className={`border-b-2 px-3 py-1.5 text-sm font-medium transition ${
                    !isPreview
                      ? "border-accent text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className={`border-b-2 px-3 py-1.5 text-sm font-medium transition ${
                    isPreview
                      ? "border-accent text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  Preview
                </button>
              </div>

              {!isPreview && (
                <div className="flex flex-wrap items-center gap-0.5">
                  <ToolbarButton label="B" onClick={() => insertMarkdown("**", true)} />
                  <ToolbarButton label="I" onClick={() => insertMarkdown("_", true)} />
                  <ToolbarButton label="<>" onClick={() => insertMarkdown("`", true)} />
                  <ToolbarButton label="#" onClick={() => insertMarkdown("### ")} />
                  <ToolbarButton label="•" onClick={() => insertMarkdown("- ")} />
                </div>
              )}
            </div>

            <div className="px-4 py-4">
              {isPreview ? (
                <div className="prose prose-sm min-h-[180px] max-w-none rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground">
                  {body.trim() ? (
                    <ReactMarkdown rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
                      {body}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted">Nothing to preview.</p>
                  )}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={placeholder}
                  className="min-h-[160px] w-full resize-y border-0 bg-transparent px-4 py-3 
                  text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
                />
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-surface/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>Supports Markdown</span>
                <span className="hidden sm:inline text-border">&middot;</span>
                <span>{body.length} characters</span>
                <span className="hidden sm:inline text-border">&middot;</span>
                <span>Ctrl/Cmd + Enter to submit</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !body.trim()}
                className="inline-flex items-center justify-center rounded-md border border-border bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : submitLabel}
              </button>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="rounded-md border border-destructive/20 bg-destructive-soft px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
    </aside>
  );
}
