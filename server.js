const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSONボディを解析
app.use(express.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// インメモリデータストア（Renderの再起動で消えるが、セッション中は保持）
// 本番環境では外部データベースを使用することを推奨
const dataStore = new Map();

// ユーザーデータを取得
app.get('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const data = dataStore.get(userId);
    if (data) {
        res.json({ success: true, data });
    } else {
        res.json({ success: true, data: null });
    }
});

// ユーザーデータを保存
app.post('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const data = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    dataStore.set(userId, data);
    console.log(`Data saved for user: ${userId}`, JSON.stringify(data).substring(0, 200));

    res.json({ success: true, updatedAt: data.updatedAt });
});

// デバッグ用：保存されているデータを確認
app.get('/api/debug/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const data = dataStore.get(userId);
    res.json({ userId, hasData: !!data, data });
});

// メインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sydney Travel Map is running on port ${PORT}`);
});
