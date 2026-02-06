# Vultr移行 - 作業状況

## 日付
2026年2月5日（最終更新）

## サーバー情報
- **IP**: 198.13.36.101
- **URL**: http://198.13.36.101
- **OS**: Ubuntu 22.04 x64
- **RAM**: 4096 MB
- **Storage**: 80 GB SSD
- **Location**: Tokyo
- **SSH接続**: `ssh -i ~/.ssh/id_ed25519 root@198.13.36.101`

## 現在の状況: デプロイ完了

### インストール済みソフトウェア
- **Node.js**: v20.20.0
- **npm**: 10.8.2
- **PM2**: 6.0.14
- **Nginx**: 1.18.0 (Ubuntu)

### 構成
- アプリパス: `/var/www/sydney-travel-map`
- サーバー: `server-sqlite.js`（SQLite永続化）
- PM2プロセス名: `sydney-travel-map`
- データベース: `/var/www/sydney-travel-map/data/travel-map.db`
- Nginx設定: `/etc/nginx/sites-available/sydney-travel-map`

### 完了した作業
1. VultrアカウントにSSHキー（claude-code）を登録
2. サーバーをSSHキー付きで再インストール（Ubuntu 22.04）
3. システム更新（apt update/upgrade）
4. Node.js v20、PM2、Nginxをインストール
5. GitHubからアプリをクローン（/var/www/sydney-travel-map）
6. npm依存関係インストール（express + better-sqlite3）
7. Nginxリバースプロキシ設定（ポート80 → localhost:3000）
8. PM2でアプリを起動・自動起動設定
9. UFWファイアウォール設定（22, 80, 443ポート許可）
10. 動作確認完了（ブラウザ + API）

## よく使うコマンド

### SSH接続
```bash
ssh -i ~/.ssh/id_ed25519 root@198.13.36.101
```

### PM2操作
```bash
pm2 list                    # プロセス一覧
pm2 logs sydney-travel-map  # ログ確認
pm2 restart sydney-travel-map  # 再起動
pm2 stop sydney-travel-map  # 停止
pm2 monit                   # モニタリング
```

### アプリ更新
```bash
cd /var/www/sydney-travel-map
git pull origin main
npm install
pm2 restart sydney-travel-map
```

### Nginx操作
```bash
nginx -t                    # 設定テスト
systemctl restart nginx     # 再起動
systemctl status nginx      # ステータス確認
```

## 今後の課題（オプション）
- [ ] ドメイン名の設定
- [ ] SSL/HTTPS証明書の設定（Certbot）
- [ ] 自動バックアップの確認

## GitHub
- リポジトリ: https://github.com/djtashikani/sydney-travel-map
