const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// JSONボディを解析
app.use(express.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// データ保存ディレクトリ
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ユーザーデータを取得
app.get('/api/sync/:userId', (req, res) => {
    const userId = req.params.userId.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const filePath = path.join(DATA_DIR, `${userId}.json`);

    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json({ success: true, data });
        } catch (e) {
            res.json({ success: true, data: null });
        }
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

    const filePath = path.join(DATA_DIR, `${userId}.json`);
    const data = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json({ success: true, updatedAt: data.updatedAt });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// メインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sydney Travel Map is running on port ${PORT}`);
});
