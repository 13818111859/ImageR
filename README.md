# 🎬 ImageR Pro - AI 图生视频程序

一个功能强大的 Web 应用，使用 AI 技术将静态图片转换为动画视频。

## ✨ 功能特性

- 🖼️ **图片上传** - 支持拖拽和点击上传
- 🎥 **AI 视频生成** - 基于图片和描述生成动画视频
- 📝 **灵活配置** - 自定义视频长度和风格
- 📊 **实时进度** - 查看视频生成进度
- ⬇️ **视频下载** - 生成完成后下载视频文件
- 📱 **响应式设计** - 支持桌面和移动设备
- 🌐 **公网访问** - 可部署到云平台

## 🚀 快速开始

### 本地开发

1. **克隆仓库**
```bash
git clone https://github.com/13818111859/ImageR.git
cd ImageR
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm run dev
```

4. **访问应用**
```
http://localhost:3000
```

### Docker 部署

1. **构建镜像**
```bash
docker build -t ai-image-to-video .
```

2. **运行容器**
```bash
docker run -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/videos:/app/videos \
  ai-image-to-video
```

3. **访问应用**
```
http://localhost:3000
```

## 📦 部署到云平台

### Vercel 部署

```bash
npm i -g vercel
vercel
```

### Heroku 部署

```bash
heroku create your-app-name
heroku git:remote -a your-app-name
git push heroku main
```

### 阿里云、腾讯云部署

1. 创建 ECS/CVM 实例
2. 安装 Node.js 和 Docker
3. 克隆项目并启动容器
4. 配置反向代理（Nginx）

## 🔧 API 文档

### 上传图片
```
POST /api/upload
Content-Type: multipart/form-data

Body: { image: File }

Response: {
  "success": true,
  "filename": "xxx.jpg",
  "path": "/uploads/xxx.jpg",
  "size": 1024,
  "mimetype": "image/jpeg"
}
```

### 生成视频
```
POST /api/generate-video
Content-Type: application/json

Body: {
  "imageFile": "xxx.jpg",
  "prompt": "一个人在海边走路",
  "duration": 5,
  "style": "realistic"
}

Response: {
  "success": true,
  "taskId": "uuid",
  "status": "processing"
}
```

### 查询任务状态
```
GET /api/task/:taskId

Response: {
  "success": true,
  "task": {
    "id": "uuid",
    "status": "processing|completed|failed",
    "progress": 50,
    "videoFile": "video-xxx.mp4",
    "error": null
  }
}
```

### 下载视频
```
GET /api/download/:filename
```

## 🎨 文件结构

```
ImageR/
├── public/                 # 前端文件
│   ├── index.html         # 主页面
│   ├── style.css          # 样式表
│   ├── video-generator.js # 视频生成器脚本
│   └── app.js             # 原图像编辑器
├── uploads/               # 上传的图片目录
├── videos/                # 生成的视频目录
├── server.js              # Express 服务器
├── package.json           # NPM 配置
├── Dockerfile             # Docker 配置
└── README.md              # 项目说明
```

## 🔐 环境变量

创建 `.env` 文件：

```env
NODE_ENV=production
PORT=3000
API_KEY=your_api_key
API_SECRET=your_api_secret
```

## 🎯 后续改进

- [ ] 集成真实 AI 视频生成 API（Runway、Pika 等）
- [ ] 用户认证和账户系统
- [ ] 视频编辑功能
- [ ] 多语言支持
- [ ] 高级滤镜和效果
- [ ] 批量处理功能
- [ ] WebSocket 实时推送进度

## 📝 许可证

MIT License

## 💬 联系方式

- GitHub: [@13818111859](https://github.com/13818111859)
- Email: 13818111859@163.com

---

**祝您使用愉快！** 🎉
