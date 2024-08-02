const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 30005;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(cors()); // 添加 CORS 中间件

app.post('/upload', upload.single('video'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('未选择文件');
    }
    res.json({ message: '视频上传成功', filename: file.originalname });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});