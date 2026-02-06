# Sydney Travel Map プロジェクト履歴

## プロジェクト概要

**Sydney Travel Map** - オーストラリア観光マップアプリケーション

シドニー・メルボルンの観光スポットやレストランなどをマップ上に表示し、経路検索やカスタムスポット追加ができるWebアプリケーション。

---

## 主な機能

### 基本機能
- **都市切り替え**: シドニー / メルボルンをタブで切り替え
- **観光スポット表示**: 各都市の観光スポットをリスト・マップ上に表示
- **経路検索**: 出発地・目的地を設定してGoogle Mapsで経路検索（公共交通/徒歩/車）
- **カスタムスポット追加**: 検索またはマップクリックでオリジナルの地点を追加
- **カテゴリ選択**: 名所/自然/文化/グルメの4カテゴリ
- **日本語検索対応**: カタカナで検索可能（例：Wホテル → W Hotel）
- **共有機能**: LINE共有、URL共有
- **データ保存**: ローカルストレージに保存、URLパラメータで共有可能

### UI/UX機能
- **地図の最小化/復元**: スマホで地図を最小化してリスト表示領域を拡大
- **確認ダイアログ**: 「最新情報に更新」ボタン押下時に確認アラート表示
- **スマホ最適化**: iPhone 13 mini等の小さい画面に対応したレスポンシブデザイン
- **ドラッグ並べ替え**: 観光地リストの順序をドラッグで変更可能

---

## 技術スタック

- **フロントエンド**: HTML/CSS/JavaScript (単一ファイル構成)
- **バックエンド**: Express.js (server.js - インメモリ版)
- **地図**: Leaflet.js + OpenStreetMap
- **検索API**: Nominatim (OpenStreetMap)
- **プロセス管理**: PM2

---

## 本番環境情報

| 項目 | 値 |
|------|-----|
| ドメイン | https://map.tashikani.jp |
| ポート | 3000 |
| 管理方法 | PM2 |
| プロセス名 | sydney-travel-map |
| ディレクトリ | /var/www/sydney-travel-map |
| GitHub | https://github.com/djtashikani/sydney-travel-map |

---

## 更新履歴

### 2026-02-06: 機能追加・改善・スマホ最適化

**実装した機能**:
1. **Twitter共有ボタンを削除** - 不要な共有オプションを削除
2. **地図の最小化/復元機能** - スマホで地図を最小化してコンテンツ領域を拡大
3. **確認アラート追加** - 「最新情報に更新」ボタンに確認ダイアログを追加
4. **観光地リスト表示エリア拡大** - 3個→6個表示できるように拡大
5. **日本語（カタカナ）検索対応** - 例：Wホテル → W Hotel Sydney で検索
6. **カスタムスポットを先頭に表示** - 追加した場所が観光地リストの一番上に表示
7. **スマホ最適化** - iPhone 13 mini対応、横スクロール問題を修正

**技術的変更**:
- `katakanaToEnglish`辞書を追加（ホテル→Hotel、レストラン→Restaurant等）
- `convertToEnglish()`関数で検索クエリを変換
- 検索結果を南半球（lat < 0）に絞り込み
- CSS メディアクエリで768px以下、375px以下の画面に対応
- `overflow-x: hidden`で横スクロールを防止

---

### 2026-02-06: Vultr統合デプロイ - 3プロジェクト完全共存構成

**背景**: video-splitter、sydney-travel-app、mind-circuitの3つのプロジェクトをVultrサーバー上で同時稼働させる統合設定を実施。

**統合アーキテクチャ**:
```
Internet
  │
  ├── video-chopper.tashikani.jp → Nginx(443/SSL) → Docker:3001
  ├── map.tashikani.jp           → Nginx(443/SSL) → PM2:3000
  └── basic.mind-circuit.jp      → Nginx(443/SSL) → PM2:3002
```

---

## デプロイ手順

### 通常のデプロイ（GitHub経由）
```bash
# ローカルで変更をコミット・プッシュ
cd "E:\Claude code\sydney-travel-app"
git add .
git commit -m "変更内容"
git push origin main

# サーバーでプル・再起動
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101
cd /var/www/sydney-travel-map
git pull origin main
pm2 restart sydney-travel-map
```

### SSH接続が不安定な場合
```bash
# Vultr APIでサーバー再起動
curl -s -X POST "https://api.vultr.com/v2/instances/c3cc151e-74b7-44e1-aaad-c05d34beb9d0/reboot" \
  -H "Authorization: Bearer YOUR_API_KEY"

# 45秒待ってから再接続
sleep 45
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101
```

---

## サーバー管理コマンド

```bash
# SSH接続
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101

# PM2状態確認
pm2 list

# アプリ再起動
pm2 restart sydney-travel-map

# ログ確認
pm2 logs sydney-travel-map --lines 50

# アプリ停止/起動
pm2 stop sydney-travel-map
pm2 start sydney-travel-map
```

---

## 現在の本番環境サマリー（2026-02-06時点）

| 項目 | 値 |
|------|-----|
| サーバー | Vultr VPS (198.13.36.101) |
| OS | Ubuntu 24.04.3 LTS |
| RAM | 4GB |
| Node.js | v22.22.0 |
| PM2 | v6.0.14 |
| Nginx | 1.24.0 |
| SSL | Let's Encrypt（有効期限: 2026-05-06） |

**同居アプリケーション**:

| アプリ | URL | ポート | 管理方法 |
|--------|-----|--------|----------|
| video-splitter | https://video-chopper.tashikani.jp | 3001 | Docker |
| sydney-travel-app | https://map.tashikani.jp | 3000 | PM2 |
| mind-circuit | https://basic.mind-circuit.jp | 3002 | PM2 |

**注意事項**:
- 新しいアプリを追加する際は、既存のポート（3000, 3001, 3002）と競合しないポートを使用すること
- サーバー再起動時はPM2が自動的にアプリを起動する設定済み
- SSH接続が不安定な場合はVultr APIでサーバーを再起動

---

*最終更新: 2026-02-06*
