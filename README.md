# SaveFrom 日本語版プロキシ (Render / Railway)

このリポジトリは、**日本語版の SaveFrom** (`https://ja.savefrom.net/195kT/`) を **Render** と **Railway** でプロキシするためのシンプルな Node.js アプリです。

プロキシのルート URL (`/`) を開くと、プロキシ自身の `/195kT/` に移動し、そのページと後続のリクエストを `ja.savefrom.net` へ中継します。ブラウザから SaveFrom へ直接移動するのではなく、プロキシを経由します。

## 機能

- `/` を開くと、プロキシ経由の `/195kT/` を表示
- ページ内の各パスも `https://ja.savefrom.net` に転送
- `/health` エンドポイント付き（Render / Railway のヘルスチェック対応）
- CORS 対応
- `TARGET_URL` 環境変数でプロキシ先 URL を変更可能
- `Accept-Language` で日本語を優先

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
| `TARGET_URL` | プロキシ先 URL（パスを含む） | `https://ja.savefrom.net/195kT/` |
| `PORT` | ポート番号 | Railway が自動設定 |

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

   - `TARGET_URL` = `https://ja.savefrom.net/195kT/`

6. **Create Web Service** をクリック

Render は自動で `PORT=10000` を設定します。

## ローカルで動かす

```bash
npm install
npm start
```

ブラウザで `http://localhost:3000` を開くと、プロキシ経由で `/195kT/` が表示されます。`/health` にアクセスするとヘルスチェック結果を確認できます。

## 注意事項

- このプロキシは `ja.savefrom.net` にアクセスするためのものです。
- 過度な利用は各プラットフォームの利用規約に抵触する可能性があります。自己責任でご利用ください。
