const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// 文件上传配置
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${uuidv4()}.${file.originalname.split('.').pop()}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// 任务队列（模拟）
const tasks = new Map();

// API 路由

// 1. 上传图片
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '没有文件被上传' });
    }

    res.json({
        success: true,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
    });
});

// 2. 生成视频
app.post('/api/generate-video', async (req, res) => {
    try {
        const { imageFile, prompt, duration = 5, style = 'realistic' } = req.body;

        if (!imageFile || !prompt) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        const taskId = uuidv4();
        const task = {
            id: taskId,
            status: 'processing',
            progress: 0,
            imageFile,
            prompt,
            duration,
            style,
            createdAt: new Date(),
            videoFile: null,
            error: null
        };

        tasks.set(taskId, task);

        // 异步处理视频生成
        generateVideoAsync(taskId, task);

        res.json({
            success: true,
            taskId,
            status: 'processing',
            message: '视频生成已开始'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. 查询任务状态
app.get('/api/task/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({ error: '任务不存在' });
    }

    res.json({
        success: true,
        task: {
            id: task.id,
            status: task.status,
            progress: task.progress,
            videoFile: task.videoFile,
            error: task.error,
            createdAt: task.createdAt
        }
    });
});

// 4. 下载视频
app.get('/api/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, 'videos', filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: '文件不存在' });
    }

    res.download(filepath);
});

// 5. 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// 异步视频生成函数
async function generateVideoAsync(taskId, task) {
    try {
        // 模拟视频生成流程
        // 实际应用中这里会调用真实的 AI 模型或 API

        // 进度更新
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            task.progress = i;
        }

        // 创建输出目录
        const videosDir = path.join(__dirname, 'videos');
        if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir, { recursive: true });
        }

        // 模拟视频文件（实际应使用真实生成的视频）
        const videoFilename = `video-${taskId}.mp4`;
        const videoPath = path.join(videosDir, videoFilename);
        
        // 创建一个简单的占位符文件
        fs.writeFileSync(videoPath, 'Mock video file');

        task.status = 'completed';
        task.progress = 100;
        task.videoFile = videoFilename;
    } catch (error) {
        task.status = 'failed';
        task.error = error.message;
    }
}

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' 
            ? '服务器错误' 
            : err.message
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`\n✅ 服务器已启动: http://localhost:${PORT}`);
    console.log(`📤 上传目录: ${uploadDir}`);
    console.log(`🎬 视频目录: ${path.join(__dirname, 'videos')}\n`);
});

module.exports = app;