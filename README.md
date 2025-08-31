# Axentax Compiler Server

axentax-compilerを使用したAxentaxシンタックスのコンパイルAPIサーバーです。

## 🚀 機能

- Axentaxシンタックスのコンパイル検証
- MIDIファイルは作成せず、コンパイルの成功/失敗のみを確認
- エラーがある場合は詳細なエラーメッセージを返却

## 📦 インストール

```bash
npm install
```

## 🏃‍♂️ 起動

### 開発モード
```bash
npm run dev
```

### 本番モード（単一ファイル実行）
```bash
# バンドルして単一の dist/index.js を生成
npm run bundle

# 単一ファイルで起動（dist配下）
node dist/index.js

# あるいは一発で
npm start
```

デフォルトでポート3000で起動します。環境変数`PORT`で変更可能です。

## 📡 API エンドポイント

### POST /compiler / GET /compiler

Axentaxシンタックスをコンパイルして、成功/失敗を確認します。

- クエリ `conduct=true` を付与すると、200でJSONを返します。
- 付与しない場合は、成功時は204 No Contentを返します。

GET の場合はクエリ `syntax` にエンコード済みのシンタックスを渡します。

#### リクエスト

```json
{
  "syntax": "@@ { C D E }"
}
```

#### レスポンス

**成功時 (200 OK) — `?conduct=true` 指定時**
```json
{
  "message": "Compilation successful",
  "compiledData": { ... }
}
```

**成功時 (204 No Content) — クエリ未指定時**
本文なし

**エラー時 (400 Bad Request)**
```json
{
  "error": "エラーメッセージ"
}
```

### GET /health

サーバーのヘルスチェック

```json
{
  "status": "OK",
  "message": "Axentax Compiler Server is running"
}
```

## 💡 使用例

### cURL

```bash
# 200 + JSON を受け取りたい場合
curl -X POST 'http://localhost:3000/compiler?conduct=true' \
  -H 'Content-Type: application/json' \
  -d '{"syntax": "@@ { C D E }"}'

# 204(No Content) で良い場合（クエリなし）
curl -X POST 'http://localhost:3000/compiler' \
  -H 'Content-Type: application/json' \
  -d '{"syntax": "@@ { C D E }"}' -i

# GET でも利用可能（syntax をクエリで渡す）
curl 'http://localhost:3000/compiler?syntax=%40%40%20%7B%20C%20%7D&conduct=true'
curl -i 'http://localhost:3000/compiler?syntax=%40%40%20%7B%20C%20%7D'
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/compiler', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    syntax: '@@ { C D E }'
  })
});

const result = await response.json();
console.log(result);
```

## 🔧 技術仕様

- **Node.js** + **Express.js**
- **axentax-compiler** v1.0.1
- **CORS** 対応
- **JSON** リクエスト/レスポンス

## 📝 Axentaxシンタックス例

```axentax
@@ {
  C D E F G A B
}

@@ 120 {
  C C C C
}

@@ D|A|D|G|A|D {
  2|2|2|0|0|0
}
```

詳細なシンタックスについては [axentax-compiler](https://www.npmjs.com/package/axentax-compiler) のドキュメントを参照してください。

## 📄 ライセンス

このプロジェクトはLICENSEファイルに記載されたライセンスの下で提供されています。
