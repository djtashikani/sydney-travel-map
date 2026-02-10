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
- **カテゴリ選択**: 名所/グルメ + 人物タブ（泰/美/天）
- **日本語検索対応**: カタカナで検索可能（例：Wホテル → W Hotel）
- **共有機能**: LINE共有、URL共有
- **データ保存**: ローカルストレージに保存、URLパラメータで共有可能

### UI/UX機能
- **地図の最小化/復元**: スマホで地図を最小化してリスト表示領域を拡大
- **ワンタップ更新**: 🔄ボタンで即座にクラウドから最新データを取得
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

### 2026-02-06: Xserver VPSへの移行完了

**サーバー情報**:
| 項目 | 値 |
|------|-----|
| プロバイダ | Xserver VPS |
| サーバー名 | tp-vps |
| IPアドレス | 162.43.55.45 |
| OS | Ubuntu 24.04 |
| vCPU | 4コア |
| メモリ | 6GB |

**移行内容**:
- tarballでソースコードを転送
- npm install --production
- PM2でプロセス起動
- Nginx設定を新規作成
- Let's Encrypt SSL証明書を取得（有効期限: 2026-05-07）

**サーバー管理コマンド（新サーバー）**:
```bash
# SSH接続
ssh -i "E:/Claude code/tp-vps/tp-vps.pem" root@162.43.55.45

# PM2状態確認
pm2 list

# アプリ再起動
pm2 restart sydney-travel-map

# ログ確認
pm2 logs sydney-travel-map --lines 50
```

---

## 現在の本番環境サマリー（2026-02-06時点）

| 項目 | 値 |
|------|-----|
| サーバー | Xserver VPS (162.43.55.45) |
| OS | Ubuntu 24.04 |
| vCPU | 4コア |
| RAM | 6GB |
| Node.js | v22.22.0 |
| PM2 | v6.0.14 |
| Nginx | 1.24.0 |
| SSL | Let's Encrypt（有効期限: 2026-05-07） |

**同居アプリケーション**:

| アプリ | URL | ポート | 管理方法 |
|--------|-----|--------|----------|
| sydney-travel-app | https://map.tashikani.jp | 3000 | PM2 |
| video-splitter | https://video-chopper.tashikani.jp | 3001 | Docker |
| mind-circuit | https://basic.mind-circuit.jp | 3002 | PM2 |
| travel-map | https://travel.tashikani.jp | 3003 | PM2 |

---

## 2026-02-07: better-sqlite3導入（データ永続化対応）

### 概要
インメモリ版（server.js）からSQLite版（server-sqlite.js）に切り替え。サーバー再起動してもデータが保持されるようになった。

### 対応内容
- travel-mapで導入済みのプリビルドバイナリ（v12.6.2, ABI v127, linux-x64）を流用
- `ecosystem.config.js`: `server.js` → `server-sqlite.js` に変更
- PM2再起動・pm2 save実施

### 動作確認
- ✅ `https://map.tashikani.jp` → HTTP 200
- ✅ `/api/admin/stats` → `{"userCount":0}`

---

## 2026-02-07: クラウド同期バグ修正・電話番号検索・ファビコン追加

### クラウド同期バグ修正

**問題**: PCでカスタム地点を追加しても、iPadで同じユーザーでログインした際にデータが反映されない。

**原因**: Nginxログを分析した結果、PCから`POST /api/sync/fukaya`が**一度も送信されていなかった**ことが判明。
- `loginUser()`でサーバーからデータを読み込み（`loadFromCloud()`）するが、サーバーにデータがない場合にローカルデータをアップロードする処理がなかった
- PM2移行時にDBファイルが新規作成され、以前のデータが失われていた

**修正内容**:
1. `loadFromCloud()` - サーバーにデータがあったかどうかを`boolean`で返すように変更
2. `loginUser()` - ログイン時にサーバーにデータがなく、ローカルにカスタム地点があれば自動アップロード
3. `DOMContentLoaded` - ページ再読み込み時も同様にローカル→クラウドの自動アップロード

### 電話番号検索機能

**概要**: カスタム追加の検索欄で電話番号を入力すると、Google Places API (New) の Text Search で場所を検索できるように。

**実装詳細**:
- `isPhoneNumber()` - 数字・ハイフン・スペース・括弧・+のみで数字6桁以上なら電話番号と判定
- `searchByPhone()` - 国際形式（`+61 X XXXX XXXX`）に変換してGoogle Places APIで検索
- 通常のテキスト検索（Nominatim）はそのまま維持
- 検索結果に📞電話番号を青色で表示

**Google Places API設定**:
- APIキー: Maps Platform API Key（video-splitterプロジェクト）
- リファラ制限: `https://map.tashikani.jp/*` のみ許可
- 有効API: Places API, Places API (New) 含む32個

**対応する電話番号形式**:
| 入力例 | 変換後 |
|--------|--------|
| `02 9360 9631` | `+61 2 9360 9631` |
| `+61 2 9360 9631` | そのまま |
| `0293609631` | `+61 293609631` |

**注意**: Google Places APIはスペース付きの国際形式でないと正確にヒットしない。スペースを除去すると空結果になる。

### ファビコン追加

- コアラのSVGファビコンを作成・設置（`/public/favicon.svg`）
- `<link rel="icon">` と `<link rel="apple-touch-icon">` をHTMLに追加

### セキュリティ対応（VPSマルウェア除去）

**発見**: Xserver VPSサポートから「外部への不審なアクセスを検知」との通知。セキュリティ監査を実施。

**マルウェア発見箇所**（全て2026-02-06 20:14に設置）:
| 場所 | 内容 | 対処 |
|------|------|------|
| root crontab | `* * * * * /tmp/x86_64.kok (deleted) startup` ×2 | `crontab -r` で削除 |
| `/etc/cron.d/root` | `* * * * * /tmp/x86_64.kok (deleted) startup` | ファイル削除 |
| `/etc/rc.local` | 30秒間隔の無限ループで`x86_64.kok`実行 | `#!/bin/bash\nexit 0` に修正 |

**安全確認済み項目**:
- マルウェア本体（`/tmp/x86_64.kok`）: 既に削除されていた
- SSH: パスワード認証無効、公開鍵認証のみ
- SSHログ: 不正ログインの形跡なし
- 不審なプロセス/systemdサービス: なし
- .bashrc/.profile: 正常

**Xserverサポートへの返信**: マルウェア除去完了の報告と、ポート制限（20,21,22のみ）の解除を依頼。

**未解決**: Xserverのポート制限が解除されるまで、video-chopperのGoogle OAuthとLet's Encrypt証明書更新が機能しない。

---

## 2026-02-07: 人物タブ追加・カテゴリ整理・UI改善

### 人物タブ追加（泰・美・天）

**概要**: 観光地タブに3つの人物タブ「泰」「美」「天」を新設。各人物ごとにおすすめの場所をカテゴリ分けして管理できるようにした。

**実装内容**:
- タブバーに「泰」「美」「天」の3タブを追加（合計6タブ: 観光地/カスタム追加/保存済み/泰/美/天）
- 各タブに専用のスポット一覧表示エリア（`personSpotsList-tai/mi/ten`）
- `renderPersonSpots()`関数を新設: カスタムスポットを`person-tai/mi/ten`カテゴリでフィルタして表示
- カスタム追加フォームに「👤 泰」「👤 美」「👤 天」カテゴリ選択を追加
- `switchTab()`を`data-tab`属性ベースに修正（`nth-child`ハードコードから脱却）
- タブボタンのスタイルを6タブ対応に縮小（padding/font-size調整）

### カテゴリ整理

- **自然・文化カテゴリを名所に統合**: 全観光スポットの`category: "nature"`/`"culture"`を`"landmark"`に変更
- カテゴリフィルタボタン: 「すべて」「🏛️ 名所」「🍽️ グルメ」の3つに簡素化
- `categoryIcons`・`getCategoryIcon()`から`nature`/`culture`を削除、`person-*`を追加

### UI改善

- 更新ボタン（🔄）の確認アラートを削除 → ワンタップで即座に最新データを取得
- `deleteSpot()`呼び出しに`isCustom: true`引数を追加（保存済みタブ・人物タブで正しく完全削除）

---

## 現在の本番環境サマリー（2026-02-07時点）

| 項目 | 値 |
|------|-----|
| サーバー | Xserver VPS (162.43.55.45) |
| OS | Ubuntu 24.04 |
| vCPU | 4コア |
| RAM | 6GB |
| Node.js | v22.22.0 |
| PM2 | v6.0.14 |
| Nginx | 1.24.0 |
| SSL | Let's Encrypt（有効期限: 2026-05-07） |
| パケットフィルタ | ON（Xserver制限: ポート20,21,22のみ） |

**同居アプリケーション（全てPM2管理）**:

| アプリ | URL | ポート | 状態 |
|--------|-----|--------|------|
| sydney-travel-map | https://map.tashikani.jp | 3000 | 正常稼働 |
| video-chopper | https://video-chopper.tashikani.jp | 3001 | 稼働（OAuth不可） |
| mind-circuit | https://basic.mind-circuit.jp | 3002 | 正常稼働 |
| travel-map | https://travel.tashikani.jp | 3003 | 正常稼働 |

---

*最終更新: 2026-02-07（人物タブ追加・カテゴリ整理）*
