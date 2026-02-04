# Vultr VPS デプロイ手順

## 1. Vultr VPS の作成

### 1.1 Vultrにログイン
https://my.vultr.com/ にアクセスしてログイン

### 1.2 サーバーを作成
1. 「Deploy New Server」をクリック
2. 以下の設定を選択:
   - **Type**: Cloud Compute - Shared CPU
   - **Location**: Tokyo（または近い地域）
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: 最小プラン（$6/月、1 vCPU、1GB RAM）で十分
   - **Server Hostname**: `sydney-travel-map`

3. 「Deploy Now」をクリック

### 1.3 サーバー情報を確認
作成後、以下の情報をメモ:
- **IP Address**: xxx.xxx.xxx.xxx
- **Password**: （自動生成されたroot password）

---

## 2. サーバーの初期設定

### 2.1 SSHでサーバーに接続
```bash
ssh root@YOUR_SERVER_IP
```

### 2.2 システムを更新
```bash
apt update && apt upgrade -y
```

### 2.3 Node.js をインストール
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # バージョン確認
npm -v
```

### 2.4 PM2 をインストール（プロセス管理）
```bash
npm install -g pm2
```

### 2.5 Nginx をインストール（リバースプロキシ）
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 2.6 ファイアウォール設定
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 3. アプリケーションのデプロイ

### 3.1 アプリ用ディレクトリを作成
```bash
mkdir -p /var/www/sydney-travel-map
cd /var/www/sydney-travel-map
```

### 3.2 Gitからクローン
```bash
git clone https://github.com/djtashikani/sydney-travel-map.git .
```

### 3.3 依存関係をインストール
```bash
npm install --production
```

### 3.4 PM2でアプリを起動
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 起動時に自動開始
```

### 3.5 動作確認
```bash
curl http://localhost:3000
```

---

## 4. Nginx リバースプロキシ設定

### 4.1 設定ファイルを作成
```bash
nano /etc/nginx/sites-available/sydney-travel-map
```

以下の内容を貼り付け:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 設定を有効化
```bash
ln -s /etc/nginx/sites-available/sydney-travel-map /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # デフォルト設定を削除
nginx -t  # 設定テスト
systemctl reload nginx
```

---

## 5. SSL証明書の設定（オプション、ドメインがある場合）

### 5.1 Certbot をインストール
```bash
apt install -y certbot python3-certbot-nginx
```

### 5.2 SSL証明書を取得
```bash
certbot --nginx -d your-domain.com
```

---

## 6. データ永続化（SQLiteを使用）

現在のインメモリストアをSQLiteに変更することで、サーバー再起動後もデータが保持されます。

### 6.1 SQLiteをインストール
```bash
npm install better-sqlite3
```

（server.jsの修正が必要 - 別途対応）

---

## 7. 更新方法

アプリを更新する場合:
```bash
cd /var/www/sydney-travel-map
git pull origin main
npm install --production
pm2 restart sydney-travel-map
```

---

## 8. 便利なコマンド

```bash
# アプリの状態確認
pm2 status

# ログを見る
pm2 logs sydney-travel-map

# アプリを再起動
pm2 restart sydney-travel-map

# Nginxの状態確認
systemctl status nginx
```

---

## 9. トラブルシューティング

### アプリが起動しない
```bash
pm2 logs sydney-travel-map --lines 50
```

### Nginxエラー
```bash
nginx -t
cat /var/log/nginx/error.log
```

### ポートが使用中
```bash
lsof -i :3000
```
