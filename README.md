# PR Dashboard

PR Dashboard 是一個 GitHub review workspace，讓你在同一個介面裡查看 Pull Request、linked issues、diff 和留言回覆。

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth
- Redux Toolkit

## Requirements

- Node.js 20+
- npm
- GitHub OAuth App

## Environment Variables

複製 `.env.example` 為 `.env.local` 後設定：

```bash
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

## Development

安裝依賴：

```bash
npm install
```

啟動開發環境：

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Main Routes

- `/`
- `/signin`
- `/dashboard`
- `/pr/[owner]/[repo]/pulls/[number]`

## Auth And Security Notes

- 未登入時，首頁會導向 `/signin`
- session 失效或逾時時，會回到登入頁重新授權
- PR 資料主要由 server-rendered pages 直接透過 GitHub API 取得
- PR detail 頁會顯示 linked issues、review thread 與 diff
- GitHub access token 不會暴露在 client-visible session data
- GitHub access token 目前存放於 NextAuth JWT session token 中，並只在 server 端取用 GitHub API
- 目前使用 GitHub OAuth App 的 classic `repo` scope
- 若未來需要更嚴格的 repository-scoped permissions，優先考慮 GitHub App migration
- 目前沒有獨立的 Issues workspace；issue 脈絡只存在於 PR detail 的 linked issues panel
