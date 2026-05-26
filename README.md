# PR Dashboard

PR Dashboard 是一個 GitHub review workspace，目標是把跨 repository 的 PR triage、review context 與回覆流程集中在單一介面，減少在 GitHub 多個頁面之間反覆切換。

## 功能概要

- 在同一個 Dashboard 聚合多個 repository 的 Pull Request，集中處理 daily triage
- 以 `Needs review`、`Waiting on author`、`Merge blocked`、`Ready to merge` 四個視角快速掌握目前待辦
- 提供 queue 統計、關鍵字搜尋與篩選，縮短找出重點 PR 的時間
- 在 PR detail 頁整合 linked issues、review thread、diff 與唯讀留言，減少來回切換 GitHub 頁面
- 支援深色與淺色模式，方便長時間審查閱讀
- 以 GitHub App user authorization 登入，直接載入使用者有權限存取的 review 工作內容

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- NextAuth
- Redux Toolkit

## Requirements

- Node.js 20+
- npm
- GitHub App

## GitHub App 設定

請先到 GitHub 建立 GitHub App：

```text
GitHub Settings → Developer settings → GitHub Apps → New GitHub App
```

本地開發建議設定：

```text
Homepage URL: http://localhost:3000
Callback URL: http://localhost:3000/api/auth/callback/github
```

Repository permissions 建議至少開啟：

```text
Pull requests: Read-only
Issues: Read-only
Metadata: Read-only
```

若你要同時支援本地與 Vercel，可以在 GitHub App 的 callback URLs 裡加入多個網址，例如：

```text
http://localhost:3000/api/auth/callback/github
https://your-app.vercel.app/api/auth/callback/github
```

建立完成後，產生 GitHub App 的 Client Secret，並將 Client ID 與 Client Secret 填入 `.env.local`。

> 這個專案目前使用 GitHub App 的 user access token web flow。
> App 也必須安裝到你要查看的 account / organization / repositories 上，登入後才看得到對應 PR。
> 目前不使用 GitHub App private key，也不走 installation token server-to-server flow。

## Environment Variables

複製 `.env.example` 為 `.env.local` 後設定：

```bash
GITHUB_APP_CLIENT_ID=your_github_app_client_id
GITHUB_APP_CLIENT_SECRET=your_github_app_client_secret
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
npm run test
npm run test:diff
npm run build
npm run start
```

`npm run test` 會執行 Vitest 掃描到的所有 `src/**/*.test.ts`。
若你只想做一次性驗證而不進入 watch / interactive 模式，可以使用：

```bash
npm run test -- --run
```

`npm run test:diff` 目前是針對 diff 邏輯的定向測試。

## Testing

- 專案使用 Vitest 進行單元測試
- 執行完整測試：`npm run test -- --run`
- 目前測試主要覆蓋 diff 呈現相關的純邏輯
- GitHub API、登入流程與頁面層級互動目前尚未有完整整合測試

若未來新增依賴環境變數的測試，建議使用 `.env.test`，不要直接依賴本機的 `.env.local`。

## Main Routes

- `/`
- `/signin`
- `/dashboard`
- `/pr/[owner]/[repo]/pulls/[number]`

## 認證流程

1. 未登入使用者會被導向 `/signin`
2. 使用者透過 GitHub App 的 user authorization flow 登入
3. NextAuth 將 GitHub access token 存放在 JWT session token 中
4. server-rendered pages 會在 server 端使用該 token 呼叫 GitHub API
5. GitHub access token 不會透過 client-visible session data 暴露給前端
6. GitHub App user access token 預設約 8 小時有效，session 逾時後使用者會回到登入頁重新授權

## 架構說明

- Next.js server-rendered pages 會直接在 server 端透過 GitHub API 載入已授權的 PR 資料
- GitHub API 呼叫只會在 server 端執行
- GitHub access token 存放於 NextAuth JWT session token，並只在 server 端取用
- Client components 主要負責互動狀態，例如 queue filter、搜尋、目前選取視角與 theme 切換
- Redux Toolkit 管理 dashboard 的 client-side state
- Tailwind CSS 負責深色與淺色模式的 UI 樣式
- PR detail 頁集中顯示 linked issues、review thread、diff 與唯讀留言區
- Diff viewer 會優先使用完整檔案內容，只有在拿不到完整內容時才退回 patch-only 或 fallback 訊息

## GitHub 權限範圍

目前實作使用 GitHub App 的 repository-scoped permissions，而不是 GitHub OAuth App 的 classic `repo` scope。

實際可見資料會受到兩層限制：

1. 使用者本身對 repository 的權限
2. GitHub App 安裝時授予該 repository 的權限

目前建議最小權限如下：

- `Pull requests: Read-only`
- `Issues: Read-only`
- `Metadata: Read-only`

## Auth And Security Notes

- 未登入時，首頁會導向 `/signin`
- session 失效或逾時時，會回到登入頁重新授權
- PR 資料主要由 server-rendered pages 直接透過 GitHub API 取得
- GitHub access token 不會暴露在 client-visible session data
- GitHub access token 目前存放於 NextAuth JWT session token 中，並只在 server 端取用 GitHub API
- 目前使用 GitHub App user authorization flow，而非 GitHub OAuth App 的 broad `repo` scope
- GitHub App user access token 預設有效期約 8 小時，目前 session 壽命與 token 壽命對齊
- comments 目前為 read-only；若要發表 review 意見或回覆，需前往 GitHub 原始 Pull Request
- 目前沒有獨立的 Issues workspace；issue 脈絡只存在於 PR detail 的 linked issues panel
