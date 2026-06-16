# BookShelf — 開発演習スターターキット

書籍レビュー共有アプリ「BookShelf」を実装するための**モノレポ雛形**です。
フロントエンド → BFF(GraphQL) → マイクロサービス(gRPC) → MySQL の**配線と疎通確認(health)まで**が用意されています。
**機能（認証・書籍・レビュー・DataLoader・認可）は未実装**です。ここがあなたのスタートラインです。

関連ドキュメント:
- [要件定義書](./docs/01_要件定義書.md)
- [開発計画書](./docs/02_開発計画書.md)

---

## 構成

```
bookshelf/
├─ apps/
│  ├─ web/              フロントエンド (Next.js 15.5 / Pages Router, Mantine 8, URQL, Zustand)
│  ├─ bff/              BFF (NestJS 11 + Mercurius GraphQL + gRPC client)
│  ├─ user-service/     ユーザー/認証マイクロサービス (NestJS gRPC, Prisma)
│  └─ catalog-service/  書籍/レビューマイクロサービス (NestJS gRPC, Prisma)
├─ packages/
│  └─ proto/            サービス間で共有する .proto 定義
├─ docker/mysql/init.sql  サービスごとのDBを作成
├─ docker-compose.yml     ローカル用 MySQL
└─ pnpm-workspace.yaml
```

ポート / 接続:

| アプリ | ポート | 役割 |
| --- | --- | --- |
| web | 3000 | ブラウザ向け画面 |
| bff | 4000 | GraphQL (`/graphql`, `/graphiql`) |
| user-service | 50051 | gRPC |
| catalog-service | 50052 | gRPC |
| MySQL | 3306 | `bookshelf_user` / `bookshelf_catalog` |

---

## 前提ツール

- Node.js 20 以上
- pnpm 9 以上（`npm i -g pnpm`）
- Docker（MySQL 用）

---

## セットアップ手順

```bash
# 1. リポジトリ直下で依存をインストール（ワークスペース一括）
pnpm install

# 2. 各アプリの .env を用意（example をコピー）
cp apps/web/.env.example           apps/web/.env.local
cp apps/bff/.env.example           apps/bff/.env
cp apps/user-service/.env.example  apps/user-service/.env
cp apps/catalog-service/.env.example apps/catalog-service/.env

# 3. MySQL を起動（bookshelf_user / bookshelf_catalog が自動作成される）
pnpm db:up

# 4. Prisma クライアント生成 & マイグレーション
pnpm prisma:generate
pnpm prisma:migrate
```

> マイグレーションは各サービスで初回に名前を聞かれます（例: `init`）。

---

## 起動

```bash
# 4アプリを並列起動
pnpm dev
```

個別に起動したい場合:

```bash
pnpm --filter user-service dev
pnpm --filter catalog-service dev
pnpm --filter bff dev
pnpm --filter web dev
```

---

## 疎通確認（ここまで通ればスタートライン到達）

1. ブラウザで <http://localhost:3000> を開く
2. 「疎通ステータス」カードに以下のように表示されれば成功:
   ```
   BFF OK | user-service: pong (received: from bff) | catalog-service: pong (received: from bff)
   ```
3. GraphQL を直接試す場合は <http://localhost:4000/graphiql> で:
   ```graphql
   query { health }
   ```

これは **web → bff(GraphQL) → user-service & catalog-service(gRPC)** が貫通していることを示します。

---

## これから実装するもの（あなたの課題）

雛形には `health`（疎通確認）だけがあります。要件定義書に沿って次を実装してください。

- **proto**: `packages/proto/src/` に `user.proto` / `catalog.proto` を追加
- **user-service**: `commands/`（SignUp, Login）`queries/` を追加。JWT 発行・パスワードハッシュ化・ULID 採番
- **catalog-service**: `commands/`（RegisterBook, PostReview, UpdateReview, DeleteReview）`queries/`（ListBooks, GetBook, ListReviews）。`ListReviewsByBookIds` 等のバッチ API
- **bff**: AuthModule / BookModule / ReviewModule。JWT 検証ガード、**DataLoader で N+1 解消**
- **web**: ログイン/サインアップ、書籍一覧/詳細、レビュー投稿/編集/削除、マイページ。`pnpm --filter web codegen` で型生成

各 `app.module.ts` と proto には `TODO(学習者)` コメントを置いています。

---

## テスト

要件に沿って4種類のテスト基盤を用意しています。いずれも**動く最小サンプルが1つずつ**入っているので、`それを真似て増やす`のが進め方です。

| 種別 | ツール | 対象 | サンプルの場所 |
| --- | --- | --- | --- |
| ユニット | **Jest** | バックエンド（ドメインロジック / commands） | `apps/*/src/**/*.spec.ts` |
| UIカタログ | **Storybook** | フロントの UI コンポーネント | `apps/web/src/components/*.stories.tsx` |
| E2E | **Playwright** | フロントの画面シナリオ | `apps/web/e2e/*.spec.ts` |
| モック | **MSW** | API（GraphQL）の差し替え | `apps/web/src/mocks/` |

### ユニットテスト（Jest）

バックエンド3アプリに Jest を設定済みです。疎通ハンドラのサンプル spec が付いています。

```bash
# 全アプリのテストをまとめて実行
pnpm -r test

# 特定アプリだけ
pnpm --filter user-service test
pnpm --filter bff test
```

- テストファイルは実装の隣に `*.spec.ts` で置きます（例: `health.controller.spec.ts`）。
- BFF のサンプル（`health.resolver.spec.ts`）は **gRPC クライアントをモック**して、サービスを起動せずに集約ロジックだけを検証する書き方を示しています。
- **学習者の課題**: `commands`（SignUp / PostReview など）のドメインロジックに対してユニットテストを書くこと。

### UIコンポーネントカタログ（Storybook）

```bash
pnpm --filter web storybook      # http://localhost:6006 で起動
pnpm --filter web build-storybook # 静的ビルド
```

- 全ストーリーは `MantineProvider` で包まれ、**MSW でモック**された状態で描画されます（`.storybook/preview.tsx`）。
- サンプル: `src/components/StatusBadge.tsx` とその `StatusBadge.stories.tsx`。
- **学習者の課題**: `BookCard` / `ReviewItem` などを小さなコンポーネントに分け、それぞれ story を書くこと。

### E2E テスト（Playwright）

```bash
# 初回のみ: ブラウザバイナリを取得
pnpm --filter web exec playwright install

# 実行（Next.js は自動起動。バックエンドの疎通まで見たい場合は別途 pnpm dev 済みにする）
pnpm --filter web test:e2e
pnpm --filter web test:e2e:ui   # UI モードでデバッグ
```

- `playwright.config.ts` の `webServer` 設定により、テスト時に `pnpm dev`（フロント）が自動起動します。
- サンプル（`e2e/home.spec.ts`）はトップページ描画のスモークテストです。
- **学習者の課題**: 「ログイン → 書籍登録 → レビュー投稿」のハッピーパスを最低1本書くこと。

### API モック（MSW）

実際の BFF を立てずに、フロント・Storybook・テストを動かすためのモックです。

```bash
# ブラウザ用ワーカーを生成（初回のみ。public/mockServiceWorker.js が作られる）
pnpm --filter web msw:init
```

- モック定義は `src/mocks/handlers.ts`（GraphQL の `Health` クエリのサンプル入り）。
- `browser.ts` … 開発時 / Storybook 用、`server.ts` … Node のテスト用。
- Storybook では既に有効化済み。開発サーバで使う場合は `_app.tsx` で `worker.start()` を条件付き起動します（学習者が必要に応じて追加）。
- **学習者の課題**: `books` / `login` などのハンドラを追加し、バックエンド未完成でもフロントを進められるようにすること。

> **テスト方針（最小ライン）**: commands のユニットテスト数本 + 主要コンポーネントの Storybook + ハッピーパスの E2E 1本。詳しくは[要件定義書 第5章・第13章](./docs/01_要件定義書.md)を参照。

---

## よく使うコマンド

| 目的 | コマンド |
| --- | --- |
| 依存インストール | `pnpm install` |
| 全アプリ起動 | `pnpm dev` |
| 特定アプリに依存追加 | `pnpm --filter web add <pkg>` |
| ユニットテスト（全アプリ） | `pnpm -r test` |
| E2E テスト（web） | `pnpm --filter web test:e2e` |
| Storybook 起動（web） | `pnpm --filter web storybook` |
| MSW ワーカー生成（web） | `pnpm --filter web msw:init` |
| MySQL 起動 / 停止 | `pnpm db:up` / `pnpm db:down` |
| Prisma マイグレーション | `pnpm prisma:migrate` |
| GraphQL 型生成（web） | `pnpm --filter web codegen` |

---

## VS Code 開発環境

このリポジトリには VS Code 用の設定が `.vscode/` に含まれています。リポジトリを開くだけで、フォーマット・Lint・デバッグが揃った状態で開発を始められます。

### 設定ファイルの構成

| ファイル | 役割 |
| --- | --- |
| `.vscode/extensions.json` | 推奨拡張機能。開いた際に右下から一括インストールできる |
| `.vscode/settings.json` | エディタ設定（保存時フォーマット、ESLint、TypeScript など） |
| `.vscode/launch.json` | デバッグ構成（各アプリ・テスト・複合起動） |
| `.vscode/tasks.json` | よく使うコマンドのタスク化（dev / db / prisma など） |
| `.editorconfig` | エディタ非依存のスタイル統一（インデント・改行コードなど） |

### 1. 推奨拡張機能を入れる

初回はコマンドパレット（`Cmd/Ctrl + Shift + P`）→ **「Extensions: Show Recommended Extensions」** から一括インストールしてください。主なもの:

- **ESLint / Prettier / EditorConfig** … コード品質・整形
- **Prisma** … `schema.prisma` の補完・整形
- **GraphQL** … クエリ補完・スキーマ連携
- **proto3** … `.proto` のシンタックスハイライト
- **Playwright / Jest** … テスト実行連携
- **Docker / Error Lens / GitLens** … 開発支援

### 2. エディタ設定（settings.json）で効くこと

- **保存時に自動フォーマット**（Prettier）＋ **ESLint 自動修正** が走る
- インデントは **スペース2**、改行は **LF**、行末空白の除去を統一
- モノレポでも各アプリ配下の ESLint 設定を自動認識（`eslint.workingDirectories`）
- プロジェクトの **TypeScript を使用**（グローバル版とのバージョン差異を防止）
- `node_modules` / `.next` / `dist` を検索・表示から除外して軽量化
- `*.proto` を proto3 として認識、`.env*` を dotenv として表示

> これらは「全員が同じスタイル・同じ品質チェックで書く」ための共有設定です。手元の好みで変えたい場合は、ユーザー設定（このファイルではなく個人の `settings.json`）で上書きしてください。

### 3. デバッグ（launch.json）

`実行とデバッグ` ビュー（`Cmd/Ctrl + Shift + D`）または **F5** で、以下の構成を選んで起動できます。ブレークポイントを置いてステップ実行が可能です。

| 構成名 | 対象 |
| --- | --- |
| `Debug: user-service` | ユーザー/認証サービス（gRPC） |
| `Debug: catalog-service` | 書籍/レビューサービス（gRPC） |
| `Debug: bff` | BFF（GraphQL） |
| `Debug: web (Next.js server)` | フロントのサーバ側（getServerSideProps 等） |
| `Debug: web (Next.js client / Chrome)` | ブラウザ上のコンポーネント |
| `Debug: Jest (現在のファイル)` | 開いているテストファイル |
| `Debug: backend (services + bff)` | 上記3サービスをまとめて起動（複合） |
| `Debug: full stack` | フロント〜バックエンド全層をまとめて起動（複合） |

**仕組み**: NestJS の各アプリは `nest start --debug --watch`（`start:debug` スクリプト）で起動し、`autoAttachChildProcesses` によりウォッチ配下の子プロセスにデバッガが自動アタッチされます。ソースマップ（`sourceMap: true`）が有効なので、`dist` ではなく **TypeScript の元ファイルにブレークポイント**を置けます。

> **デバッグの始め方（例: BFFのリゾルバを追う）**
> 1. 先に `pnpm db:up` で MySQL を起動しておく
> 2. F5 → `Debug: backend (services + bff)` を選ぶ
> 3. `apps/bff/src/.../*.resolver.ts` にブレークポイントを置く
> 4. ブラウザや GraphiQL からクエリを投げると、その行で実行が止まる

### 4. タスク（tasks.json）

コマンドパレット → **「Tasks: Run Task」** から、ターミナルにコマンドを打たずに実行できます。

- `install` / `dev (all)` / `test (all)` / `lint (all)`
- `db: up` / `db: down`
- `prisma: migrate` / `prisma: generate`
- `graphql: codegen (web)`

---

## トラブルシューティング

| 症状 | 確認ポイント |
| --- | --- |
| web で「BFF に接続できません」 | bff と両サービスが起動しているか。`apps/web/.env.local` の `NEXT_PUBLIC_BFF_URL` |
| bff 起動時に gRPC 接続エラー | `apps/bff/.env` の `*_SERVICE_URL`、サービスの待ち受けポート |
| Prisma が DB に繋がらない | `pnpm db:up` 済みか、`DATABASE_URL` のDB名・認証情報 |
| `@bookshelf/proto` が解決できない | リポジトリ直下で `pnpm install` を実行したか |

困ったら30〜45分で抱え込まずメンターへ（[開発計画書 第6章](./docs/02_開発計画書.md)）。
