# PR Dashboard Repository Guide

## Critical Rule

This repo runs on `next@16.2.3`. Do not assume older Next.js behavior.

Before changing App Router structure, Route Handlers, auth flow, or server/client boundaries, read the relevant docs under `node_modules/next/dist/docs/`.

## Project Summary

This project is a GitHub PR triage workspace built with:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth with GitHub OAuth
- Redux Toolkit
- `lucide-react`

Current scope:

- cross-repo Pull Request triage dashboard
- Pull Request detail page with linked issues, diff, and comments
- no standalone Issues workspace
- no checked-in mock dashboard data source

## Runtime Requirements

Expected env vars:

- `GITHUB_ID`
- `GITHUB_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Without a valid GitHub session, protected pages redirect to `/signin?callbackUrl=...`.

## Auth And Session Model

- NextAuth uses JWT session strategy
- GitHub access token is stored in the NextAuth JWT and used server-side only
- client-visible session data must not expose the GitHub token
- `/signin` is the single surface for auth-related UI messaging

Current sign-in error states:

- `AccessDenied`: GitHub OAuth was cancelled
- `SessionRequired`: protected route was accessed without a usable session
- `SessionExpired`: GitHub credentials are no longer valid
- `SessionTimedOut`: client-side session timeout watcher forced sign-out

Current session TTL in code is intentionally short for testing:

- `AUTH_SESSION_EXPIRY_SECONDS = 60`

Do not treat that value as a production default unless the requirement explicitly says so.

## Security Note

This project currently uses a GitHub OAuth app with classic `repo` scope.

Implications:

- keep GitHub API access server-side
- do not expose the token through session serialization
- this is broader than ideal least privilege
- if tighter repo-scoped permission control becomes important, prefer a GitHub App migration

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`

`npm run lint` is the minimum validation step after code changes.

## Current Architecture

### App Router

- `src/app/layout.tsx`
  - root layout
  - injects initial theme script with `next/script`
  - mounts providers
- `src/app/page.tsx`
  - top-level auth gate
  - redirects authenticated users to `/dashboard`
- `src/app/signin/page.tsx`
  - shared sign-in page
  - renders auth error UI
  - supports `forceLogin=1`
- `src/app/dashboard/page.tsx`
  - server-rendered dashboard entry
  - fetches live triage PR data
- `src/app/pr/[owner]/[repo]/pulls/[number]/page.tsx`
  - server-rendered PR detail entry
  - fetches PR detail, linked issues, diff, and comments context

### API Routes

- `src/app/api/auth/[...nextauth]/route.ts`
  - NextAuth route handler
- `src/app/api/comment/route.ts`
  - GitHub comment read/write proxy
  - only for PR-visible targets

### Core Libraries

- `src/lib/auth.ts`
  - NextAuth config
  - session TTL constants
  - GitHub provider scope config
- `src/lib/server-auth.ts`
  - resolves server session and access token
- `src/lib/github-session.ts`
  - auth-related signin path builders
  - GitHub auth failure redirect helper
- `src/lib/github.ts`
  - GitHub REST and GraphQL fetch helpers
  - triage-oriented PR aggregation and normalization
- `src/lib/triage.ts`
  - triage labels, descriptions, options, and queue count helpers
- `src/lib/theme.ts`
  - theme helpers and bootstrap script
- `src/lib/github-visibility.ts`
  - visibility checks for comment API access

### Types And Utilities

- `src/types/index.ts`
  - main PR domain types
- `src/types/next-auth.d.ts`
  - NextAuth JWT type augmentation for `accessToken`
- `src/utils/time.ts`
  - small date/time formatting helpers
  - currently not part of the main dashboard flow

### State Management

- `src/store/index.ts`
  - Redux store setup
- `src/store/filter-slice.ts`
  - dashboard queue/search filter state
  - queue count derivation
- `src/store/pr-slice.ts`
  - PR list selection state
- `src/store/hooks.ts`
  - typed Redux hooks

Prefer server-side data fetching first. Use Redux for client-side interaction after initial payload hydration.

### Components

- `src/components/layout/*`
  - header, sidebar, page shell
- `src/components/pr/*`
  - dashboard stats, filters, list, cards, linked issue panels
- `src/components/diff/diff-viewer.tsx`
  - client component
  - wraps `react-diff-viewer-continued` directly
  - do not reintroduce a thin client wrapper unless there is a concrete need
- `src/components/comment/comment-box.tsx`
  - review thread and composer
- `src/components/auth/session-timeout-watcher.tsx`
  - forces sign-out when current session expires
- `src/components/theme-toggle.tsx`
  - light/dark mode toggle
- `src/components/notifications-menu.tsx`
  - queue-oriented notification entry points

## Triage Model

Dashboard queue states:

- `needs-review`
- `waiting-on-author`
- `merge-blocked`
- `ready-to-merge`

Current PR intake is triage-oriented and cross-repo:

- `author:{viewerLogin}`
- `review-requested:{viewerLogin}`

Results are deduped, sorted, then classified into the four queue states.

When changing triage behavior:

- update `src/lib/github.ts` classification rules
- keep labels and descriptions in `src/lib/triage.ts` aligned
- verify Dashboard stats, filter bar, sidebar, and notifications still match the same queue model

## Styling

- global styles live in `src/styles/globals.css`
- theme is driven by `html[data-theme="light|dark"]`
- prefer Tailwind utility tokens backed by CSS variables
- use semantic utilities like `bg-background`, `text-foreground`, `border-border`, `bg-surface`
- keep UI compatible with both light and dark themes

Do not introduce a second global stylesheet.

## UI And Copy

- default copy should be Traditional Chinese
- keep product/domain terms in English when clearer:
  - Pull Request
  - Dashboard
  - Diff
  - Session
  - Queue
- use `lucide-react` for UI icons
- reuse shared `Header` and `Sidebar` patterns instead of forking variants

## Working Rules

### Routing And Data Fetching

- prefer Server Components for authenticated reads
- use Route Handlers only when the browser needs direct server interaction
- keep auth checks at page or handler entry
- use `src/lib/server-auth.ts` when both session and access token are needed
- build signin redirects through `src/lib/github-session.ts`, not ad hoc query string assembly

### GitHub API Integration

- reuse `src/lib/github.ts`
- keep GitHub headers consistent:
  - `Authorization: Bearer ...`
  - `Accept: application/vnd.github+json`
  - `X-GitHub-Api-Version: 2022-11-28`
- normalize GitHub responses into app-level types before handing them to UI

### Client Boundaries

Only add `"use client"` when needed for:

- local state
- effects
- event handlers
- browser APIs
- Redux hooks
- third-party browser-only components

Keep client boundaries small, but not so fragmented that they become thin wrappers with no real value.

### Structure Discipline

- do not reintroduce pass-through wrappers like the removed `Workspace`
- do not add one-off thin client wrappers like the removed `DiffViewerClient` unless the boundary is genuinely necessary
- remove dead hooks and commented-out integrations instead of preserving them as placeholders
- consolidate duplicate logic instead of creating a third abstraction

## Validation

After meaningful changes, prefer:

1. `npm run lint`
2. `npm run build`

If `next build` fails inside sandbox because Turbopack needs capabilities the sandbox blocks, rerun it outside the sandbox rather than assuming the project is broken.
