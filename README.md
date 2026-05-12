# PR Dashboard

PR Dashboard 是一個 GitHub review workspace，目標是把跨 repository 的 PR triage、review context 與回覆流程集中在單一介面，減少在 GitHub 多個頁面之間反覆切換。

## 功能概要

- 在同一個 Dashboard 聚合多個 repository 的 Pull Request，集中處理 daily triage
- 以 `Needs review`、`Waiting on author`、`Merge blocked`、`Ready to merge` 四個視角快速掌握目前待辦
- 提供 queue 統計、關鍵字搜尋與篩選，縮短找出重點 PR 的時間
- 在 PR detail 頁整合 linked issues、review thread、diff 與留言輸入框，減少來回切換 GitHub 頁面
- 支援深色與淺色模式，方便長時間審查閱讀
- 以 GitHub OAuth 登入，直接載入使用者有權限存取的 review 工作內容

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth
- Redux Toolkit

## Requirements

- Node.js 20+
- npm
- GitHub OAuth App

## GitHub OAuth App 設定

請先到 GitHub 建立 OAuth App：

```text
GitHub Settings → Developer settings → OAuth Apps → New OAuth App
```

本地開發建議設定：

```text
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

建立完成後，將 GitHub OAuth App 的 Client ID 與 Client Secret 填入 `.env.local`。

## Environment Variables

複製 `.env.example` 為 `.env.local` 後設定：

```bash
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

可以用以下指令產生本地開發用的 `NEXTAUTH_SECRET`：

```bash
openssl rand -base64 32
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

## 認證流程

1. 未登入使用者會被導向 `/signin`
2. 使用者透過 GitHub OAuth 登入
3. NextAuth 將 GitHub access token 存放在 JWT session token 中
4. server-rendered pages 會在 server 端使用該 token 呼叫 GitHub API
5. GitHub access token 不會透過 client-visible session data 暴露給前端
6. session 失效或逾時時，使用者會回到登入頁重新授權

## 架構說明

- Next.js server-rendered pages 會直接在 server 端透過 GitHub API 載入已授權的 PR 資料
- GitHub API 呼叫只會在 server 端執行
- GitHub access token 存放於 NextAuth JWT session token，並只在 server 端取用
- Client components 主要負責互動狀態，例如 queue filter、搜尋、目前選取視角與 theme 切換
- Redux Toolkit 管理 dashboard 的 client-side state
- Tailwind CSS 負責深色與淺色模式的 UI 樣式
- PR detail 頁集中顯示 linked issues、review thread、diff 與留言輸入區

## GitHub 權限範圍

目前實作使用 GitHub OAuth App 的 classic `repo` scope。

這讓 PR Dashboard 可以讀取 authenticated user 有權限存取的 private repositories 與 Pull Requests。

若未來需要更嚴格的 repository-scoped permissions，建議優先評估 migration 到 GitHub App authentication model。

## Auth And Security Notes

- 未登入時，首頁會導向 `/signin`
- session 失效或逾時時，會回到登入頁重新授權
- PR 資料主要由 server-rendered pages 直接透過 GitHub API 取得
- GitHub access token 不會暴露在 client-visible session data
- GitHub access token 目前存放於 NextAuth JWT session token 中，並只在 server 端取用 GitHub API
- 目前使用 GitHub OAuth App 的 classic `repo` scope
- 若未來需要更嚴格的 repository-scoped permissions，優先考慮 GitHub App migration
- 目前沒有獨立的 Issues workspace；issue 脈絡只存在於 PR detail 的 linked issues panel
