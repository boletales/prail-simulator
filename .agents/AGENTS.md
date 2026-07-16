# Antigravity Rules for `prail/purs`

本プロジェクト（`prail/purs`）でAIアシスタント（Antigravity）が自律的または協調的に開発・メンテナンス作業を行うためのガイドラインおよび開発ルールを定義します。

---

## 1. プロジェクト概要

本リポジトリは、PureScript で実装された鉄道模型レイアウトシミュレータのコアロジック、クライアント、およびサーバーサイド同期システムです。

- **`src/`**: PureScriptソースコード。レイアウト定義、車両の挙動シミュレーション、信号ロジック、およびJSONシリアライズ/デシリアライズなどの中心ロジックが含まれます。
- **`server/`**: Node.js (Express + Socket.IO) で構成されたWebサーバー。コンパイルされたPureScriptのJavaScript成果物を読み込んで動作します。
- **`server/docs/`**: 静的アセット、HTML、およびブラウザ側で描画を行うJavaScript（3D, 2D表示、入力制御など）が含まれます。

※ プロジェクトのより詳細な内部構造、主要モジュールの構成、およびデータ同期フローについては、プロジェクトルートの [ARCHITECTURE.md](file:///home/boletales/garage/prail/purs/ARCHITECTURE.md) を参照してください。

---

## 2. 開発コマンド・ビルド方法

コードの変更を行った際は、以下の手順でビルドおよび動作検証を行ってください。

### 2.1. PureScript のビルド
PureScriptコードのビルドおよびJavaScript成果物のバンドルは、プロジェクトルートにある [build.sh](file:///home/boletales/garage/prail/purs/build.sh) を使用して行います。
```bash
./build.sh
```
※ 内部的には以下のコマンドが実行されます：
`spago build && purs-backend-es bundle-module --no-build --to server/docs/main.js`
トランスパイルエンジンとして `purs-backend-es` を使用しています。

### 2.2. テストの実行
現時点のテストスイートは最低限のスケルトンです。
```bash
spago test
```

### 2.3. サーバーの実行
シミュレータの通信・同期サーバーを起動するには、`server` ディレクトリに移動して依存関係を解決したのち、起動します。
```bash
# 依存関係のインストール（必要な場合のみ）
cd server && npm install
# サーバー起動
node index.mjs
```

---

## 3. コーディング規約と設計上の注意点

### 3.1. PureScript特有の注意点
- **コンパイル警告の抑制**: `spago.yaml` において、`ImplicitImport`, `ImplicitQualifiedImport`, `MissingTypeDeclaration` が `censorProjectWarnings` に指定されています。しかし、新しくコードを書く際は保守性のため可能な限り明示的なインポートおよび型シグネチャの定義を推奨します。
- **FFI (Foreign Function Interface)**: JavaScript側との連携部分（`Foreign` 等）は、データの型安全性に留意し、不整合が発生しないように注意してください。

### 3.2. データモデル（Layout・Train等）の設計
- シミュレータのメインデータ構造は [Layout.purs](file:///home/boletales/garage/prail/purs/src/Internal/Layout/Types/Layout.purs) の `Layout` レコードで定義されています。
- `Layout` はサーバー・クライアント間でJSONシリアライズ（[JSON.purs](file:///home/boletales/garage/prail/purs/src/Internal/JSON.purs)）され、Socket.IO を介して同期されます。
- `Layout` や `Trainset`、`RailNode` などの中心的なデータ構造にフィールドを追加・削除する際は、必ず **シリアライズ/デシリアライズ処理（`encodeLayout` / `decodeLayout` 等）の修正** をセットで行ってください。同期崩れの原因になります。
  - 特に、既存のセーブデータ（`docs/preset/layout/*.json`）の後方互換性は維持する必要があります。セーブデータのフォーマットが変わる際は、必ずマイグレーションの処理について検討してください。

---

## 4. エージェントの行動ルール（作業プロセス）

1. **インクリメンタルな変更とビルド検証**:
   - 一度に大量のファイルを変更するのではなく、小さな単位で編集を行い、都度 `./build.sh` を実行して PureScript のコンパイルが通ることを確認してください。
2. **既存コメントと構造の維持**:
   - 変更箇所以外のコードコメントや既存のモジュール構造を尊重し、不要な変更を加えないでください。
3. **ファイルリンクの活用**:
   - ユーザーとのチャットでは、ファイル名や関数・型名に必ず Markdown 形式のファイルリンク（例: `[Layout.purs](file:///home/boletales/garage/prail/purs/src/Internal/Layout/Types/Layout.purs)`）を付与して説明してください。
4. **ドキュメントの追従 (ARCHITECTURE.mdの更新)**:
   - ディレクトリ構造の変更、主要コンポーネントの追加・削除、あるいはデータ同期フローの仕様変更を伴うリファクタリングなどを行った際は、必ずプロジェクトルートの [ARCHITECTURE.md](file:///home/boletales/garage/prail/purs/ARCHITECTURE.md) もあわせて更新し、常に現状と一致するように維持してください。
