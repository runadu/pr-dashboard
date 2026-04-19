# PR Dashboard Repository Guide

## Critical Rule

This repo is on `next@16.2.3`. Do not assume older Next.js behavior.

Before changing any of the following, read the relevant docs under `node_modules/next/dist/docs/`:

- App Router file conventions
- Route Handlers
- NextAuth integration points
- Server vs Client Component boundaries
- any new or deprecated Next APIs

This is the same constraint noted in `AGENTS.md`, but repeated here because it is easy to miss and high-impact.

## Project Summary

This project is a GitHub Pull Request dashboard built with:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth with GitHub OAuth
- Redux Toolkit for client-side list/filter state
- `lucide-react` for icons

Primary user flow:

1. User signs in with GitHub
2. Server components fetch Pull Request data using the GitHub access token
3. Dashboard renders the PR list
4. Pull Request detail renders comments, linked issues, and diff for a single PR

## Runtime Requirements

Expected env vars:

- `GITHUB_ID`
- `GITHUB_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Without a valid GitHub token, the main entry pages redirect to `/signin?callbackUrl=...`.

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`

`npm run lint` is the minimum validation step after code changes.

## Current Architecture

### App Router

- `src/app/layout.tsx`
  - root layout
  - injects the initial theme script with `next/script` before hydration
  - wraps children with `ReduxProvider`
- `src/app/page.tsx`
  - auth gate
  - redirects authenticated users to `/dashboard`
- `src/app/signin/page.tsx`
  - unauthenticated sign-in landing page
  - uses the shared `Header` component in `minimal` mode
  - supports `forceLogin=1` to bypass the normal signed-in redirect
  - shows reauth messaging for `SessionExpired` and `SessionTimedOut`
  - uses a GitHub-styled sign-in CTA instead of the generic accent button
- `src/app/dashboard/page.tsx`
  - server-rendered dashboard page
  - fetches live Pull Request data from GitHub
- `src/app/pr/[owner]/[repo]/pulls/[number]/page.tsx`
  - server-rendered Pull Request detail page
  - fetches PR list, changed files, and linked issues

### API Routes

- `src/app/api/auth/[...nextauth]/route.ts`
  - NextAuth route handler
- `src/app/api/comment/route.ts`
  - reads and posts GitHub issue comments for a PR
  - proxies `GET` and `POST` calls to the GitHub Issues Comments API
  - validates that the requested target is visible in the app before proxying the request
- there is no longer a checked-in `src/app/api/prs/*` route in the repo

### Core Libraries

- `src/lib/auth.ts`
  - NextAuth GitHub provider config
  - stores GitHub access token in JWT and session
- `src/lib/server-auth.ts`
  - shared helper for resolving server-side session and access token
  - used by App Router pages and route handlers instead of duplicating auth lookup logic
- `src/lib/github-session.ts`
  - builds reauth paths and redirects on GitHub auth/session failures
- `src/lib/github-visibility.ts`
  - determines whether a PR or Issue target is visible inside the app workspace
  - used to gate comment API access
- `src/lib/github.ts`
  - shared GitHub API wrapper and fetch helpers
  - preferred place for new GitHub integrations
- `src/lib/theme.ts`
  - shared theme constants and the initial inline theme script
- `src/lib/triage.ts`
  - triage queue labels, descriptions, options, and queue-count helpers

### State Management

- `src/store/index.ts`
  - Redux store setup
- `src/store/pr-slice.ts`
  - PR list / selected PR / hasLoaded state
- `src/store/filter-slice.ts`
  - dashboard filtering and selectors
- `src/store/hooks.ts`
  - typed Redux hooks

Use server-side fetching first. Use Redux for interactive client state after the initial server payload is available.
`MainLayout` also persists the sidebar collapsed preference in localStorage and mounts `SessionTimeoutWatcher`.

### Components

- `src/components/layout/*`
  - page shell, header, sidebar
  - `Header` supports `full` and `minimal` variants
- `src/components/pr/*`
  - PR cards, list, filter bar, status badge, linked issue panels
- `src/components/diff/*`
  - diff presentation
- `src/components/comment/comment-box.tsx`
  - comment thread + composer
- `src/components/theme-toggle.tsx`
  - light/dark mode toggle
- `src/components/auth/github-sign-in-button.tsx`
  - client-side GitHub OAuth trigger button
  - intentionally styled to resemble GitHub's sign-in button
- `src/components/auth/session-timeout-watcher.tsx`
  - signs the user out when the current session expires and redirects to reauth
- `src/components/user-menu.tsx`
  - header user menu

### Styling

- Global styles live in `src/styles/globals.css`
- Theme tokens are defined as CSS variables there
- Light/dark mode is driven by `html[data-theme="light|dark"]`
- Use existing CSS tokens such as:
  - `--background`
  - `--foreground`
  - `--surface`
  - `--border`
  - `--accent`

Do not add a second global stylesheet.

## Type Sources

Current type usage is not fully consolidated:

- `src/types/index.ts` is used by the live dashboard and GitHub helpers
- `src/types/next-auth.d.ts` augments `Session` and `JWT` with `accessToken`

When touching PR domain types, prefer keeping `src/types/index.ts` as the main source instead of splitting definitions again.

## Current Inconsistencies To Be Aware Of

This repo is functional but not fully cleaned up. Important examples:

- `src/app/dashboard/page.tsx` uses live GitHub data
- current dashboard flow hydrates Redux from server-fetched data
- `src/.DS_Store` is present and should be treated as junk

Do not create a third implementation of the same concern. Consolidate instead.

## Working Rules

### Routing and Data Fetching

- Prefer Server Components for authenticated data reads
- Use Route Handlers only when the browser must call the server directly
- Keep auth checks close to the page or handler entrypoint
- Prefer redirecting to `/signin?callbackUrl=...` for unauthenticated page access
- Prefer `src/lib/server-auth.ts` when a page or route needs both the session object and the access token
- Reauth/session-expiry redirects should go through `src/lib/github-session.ts` or `SessionTimeoutWatcher`, not ad hoc query-string construction

### GitHub API Integration

- Reuse `src/lib/github.ts` instead of scattering raw `fetch("https://api.github.com/...")`
- Keep GitHub headers consistent:
  - `Authorization: Bearer ...`
  - `Accept: application/vnd.github+json`
  - `X-GitHub-Api-Version: 2022-11-28`
- Normalize GitHub responses into app-level types before handing data to UI components
- If you touch auth/session error handling around GitHub requests, check `src/lib/github-session.ts` before adding redirect logic elsewhere

### Client Components

Only add `"use client"` when needed for:

- local state
- effects
- event handlers
- browser APIs
- Redux hooks

Keep the client boundary as small as practical.

### UI and Copy

- Default UI copy should be Traditional Chinese
- Keep domain/product terms in English when they are clearer or more conventional
  - examples: Pull Request, Dashboard, Diff, Session
- Reuse `lucide-react` icons for new UI icons
- Keep the sign-in page visually aligned with the rest of the app:
  - use the shared `Header` in `minimal` mode instead of forking a new header
  - keep theme switching available before login
  - do not restyle the GitHub sign-in button away from a GitHub-like affordance unless the requirement changes

### Styling

- Reuse existing CSS tokens and spacing patterns
- Match the current glass/surface visual language
- Prefer a single outer shell with divider lines over stacked adjacent borders when working on page layout
- Keep components compatible with both light and dark theme
- Do not hardcode dark-only colors unless there is no token that fits

### State and Selectors

- Put shared filter logic in Redux selectors, not duplicated in components
- Keep async data fetching logic out of presentational components where possible
- If server data is already available, prefer passing it down over refetching on mount

## Preferred Files For New Work

Use these as the default insertion points:

- new GitHub API helper: `src/lib/github.ts`
- new app-level type: `src/types/index.ts` or a type consolidation change
- new dashboard UI: `src/components/pr/*` or `src/components/layout/*`
- new page route: `src/app/**/page.tsx`
- new route handler: `src/app/api/**/route.ts`
- new global token/style: `src/styles/globals.css`

## Known Follow-Up Work

These are reasonable cleanup targets if you touch adjacent areas:

- consolidate duplicated PR list implementations
- replace raw `<img>` usage in header/comment UIs with `next/image` where appropriate
- align sidebar active state with query-string filters if query-based navigation remains

## Definition of Done For Small Changes

For typical code changes:

1. update implementation
2. keep App Router / Next 16 conventions valid
3. run `npm run lint`
4. avoid introducing another duplicate abstraction

If a change affects auth, routing, or Next runtime behavior, verify the relevant Next 16 docs first.
