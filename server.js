const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// メインページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sydney Travel Map is running on port ${PORT}`);
});
