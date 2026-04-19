# PR Dashboard

PR Dashboard 是一個 GitHub review workspace，讓你在同一個介面裡查看 Pull Request、Issue、diff 和留言回覆。

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

在 `.env.local` 設定：

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

## Notes

- 未登入時，首頁會導向 `/signin`
- session 失效或逾時時，會回到登入頁重新授權
- PR 資料主要由 server-rendered pages 直接透過 GitHub API 取得
- PR detail 頁會顯示 linked issues、review thread 與 diff
