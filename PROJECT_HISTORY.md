# Sydney Travel Map プロジェクト履歴

## プロジェクト概要

**Sydney Travel Map** - シドニー旅行マップアプリケーション

シドニーの観光スポットやレストランなどをマップ上に表示するWebアプリケーション。

---

## 技術スタック

- **フロントエンド**: HTML/CSS/JavaScript (静的ファイル)
- **バックエンド**: Express.js
- **データベース**: SQLite3
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

**sydney-travel-appの構成**:
- **デプロイ方法**: PM2 (ecosystem.config.js)
- **ポート**: 3000
- **自動起動**: PM2 startup設定済み

**サーバー管理コマンド**:
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

**デプロイ手順**:
```bash
# ローカルからファイルをアップロード
scp -i ~/.ssh/id_ed25519 -r ./server.js ./package.json ./public root@198.13.36.101:/var/www/sydney-travel-map/

# サーバーで再起動
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101
cd /var/www/sydney-travel-map
npm install --production
pm2 restart sydney-travel-map
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

---

*最終更新: 2026-02-06*
