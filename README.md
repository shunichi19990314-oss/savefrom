# SaveFrom Cloudflare Worker Proxy (Render / Railway)

このリポジトリは、Cloudflare Worker (`https://savefrom.shunichi-0314.workers.dev/`) を **Render** と **Railway** でプロキシするためのシンプルな Node.js アプリです。

## 機能

- すべてのリクエストを指定の Cloudflare Worker に転送
- `/health` エンドポイント付き（Render / Railway のヘルスチェック対応）
- CORS 対応
- 環境変数でターゲットURL変更可能

## デプロイ方法

### 1. Railway にデプロイ

1. [Railway](https://railway.app) にログイン
2. **New Project** → **Deploy from GitHub repo**
3. このリポジトリを選択
4. 自動でデプロイされます（`PORT` は Railway が自動設定）
5. 生成された URL でアクセス可能

必要に応じて環境変数を追加：

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `TARGET_URL` | プロキシ先URL | `https://savefrom.shunichi-0314.workers.dev` |
| `PORT` | ポート番号 | Railwayが自動設定 |

### 2. Render にデプロイ

1. [Render](https://render.com) にログイン
2. **New** → **Web Service**
3. この GitHub リポジトリを接続
4. 以下の設定を入力：

   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free（または任意）

5. **Advanced** で環境変数を追加（任意）：

   - `TARGET_URL` = `https://savefrom.shunichi-0314.workers.dev`

6. **Create Web Service** をクリック

Render は自動で `PORT=10000` を設定します。

## ローカルで動かす

```bash
npm install
npm start
```

ブラウザで `http://localhost:3000` にアクセスすると、Cloudflare Worker の内容が表示されます。

## 注意事項

- このプロキシは Cloudflare Worker 経由で `savefrom.net` にアクセスするためのものです。
- 過度な利用は Cloudflare や各プラットフォームの利用規約に抵触する可能性があります。自己責任でご利用ください。
