# Sydney/Melbourne Travel Map - プロジェクト構成

## 概要
オーストラリア（シドニー・メルボルン）旅行用の観光マップWebアプリケーション

## 作成日
2024年2月4日

## 機能一覧
- シドニー・メルボルンの観光地マップ表示
- 観光地の選択・ピン表示（Leaflet.js使用）
- Google Mapsで経路検索（公共交通・徒歩・車）
- カスタム地点の追加（日本語/英語検索対応、Nominatim API使用）
- カテゴリ選択（名所・自然・文化・グルメ）
- ドラッグ＆ドロップで観光地リストの並べ替え
- クラウド同期（ユーザーID入力で端末間共有）
- 更新ボタンで最新データ取得
- URL共有（LINE/Twitter）
- 観光地の削除・復元機能

## ディレクトリ構成
```
sydney-travel-app/
├── .git/                  # Gitリポジトリ
├── .gitignore             # Git除外設定
├── docs/                  # ドキュメント
│   └── PROJECT_STRUCTURE.md
├── package.json           # Node.js依存関係
├── server.js              # Express サーバー（API含む）
└── public/
    └── index.html         # メインアプリケーション（HTML/CSS/JS）
```

## 技術スタック
- **フロントエンド**: HTML, CSS, JavaScript (Vanilla)
- **地図ライブラリ**: Leaflet.js 1.9.4
- **地図タイル**: OpenStreetMap
- **検索API**: Nominatim (OpenStreetMap)
- **経路検索**: Google Maps（外部リンク）
- **バックエンド**: Node.js + Express
- **データ保存**:
  - ローカル: localStorage
  - クラウド: インメモリストア（サーバー側）

## API エンドポイント
- `GET /api/sync/:userId` - ユーザーデータ取得
- `POST /api/sync/:userId` - ユーザーデータ保存
- `GET /api/debug/:userId` - デバッグ用データ確認

## 観光地データ
### シドニー (ID: 1-15)
1. オペラハウス
2. ハーバーブリッジ
3. ボンダイビーチ
4. ロイヤル植物園
5. タロンガ動物園
6. ダーリングハーバー
7. ザ・ロックス
8. フィッシュマーケット
9. チャイナタウン
10. NSW美術館
11. シドニータワー
12. マンリービーチ
13. ルナパーク
14. サーキュラーキー
15. ブルーマウンテンズ

### メルボルン (ID: 101-115)
101. フェデレーションスクエア
102. フリンダースストリート駅
103. クイーンビクトリアマーケット
104. メルボルン王立植物園
105. セントキルダビーチ
106. ビクトリア州立図書館
107. メルボルン博物館
108. ホイジャーレーン
109. ユーレカタワー
110. メルボルン動物園
111. ブライトンビーチ
112. グレートオーシャンロード
113. サウスメルボルンマーケット
114. チャイナタウン
115. メルボルンクリケットグラウンド

## デプロイ情報
### Render (旧)
- URL: https://sydney-travel-map.onrender.com
- GitHub: https://github.com/djtashikani/sydney-travel-map

## 注意事項
- Renderの無料プランではサーバーが15分で停止し、インメモリデータが消失
- 永続的なデータ保存にはデータベース（MongoDB等）の導入が必要
