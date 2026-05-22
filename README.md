# 🎬 ImageR Pro - AI 图生视频程序

支持 **4 大真实 AI 服务**，可通过 **公网访问**

---

## ✨ 核心特性

### 🎨 集成的 AI 服务

| 服务 | 特点 | 适用场景 | 成本 |
|------|------|---------|------|
| **Runway AI** | 好莱坞级，Gen-3/Gen-2 | 专业视频制作、电影预演 | $0.10/分钟 |
| **Pika** | 快速高效，性价比高 | 社交媒体、营销内容 | $0.05/分钟 |
| **HeyGen** | 虚拟主播，多语言口型同步 | 企业培训、国际营销 | $0.08/分钟 |
| **Synthesia** | 企业级数字人，合规性强 | 大型组织内容生产 | $0.12/分钟 |

### 🌐 支持的部署方式

- ✅ **Vercel + Render**（最简单，推荐）- 免费
- ✅ **阿里云/腾讯云 ECS**（中国最快）- ¥50-60/月
- ✅ **AWS EC2**（国际通用）- $10/月
- ✅ **Docker 自建**（完全控制）

### 📱 功能清单

- 🖼️ **图片上传** - 支持拖拽和点击上传
- 🎥 **AI 视频生成** - 基于图片和文字描述生成动画视频
- 🎨 **多种模型** - 4 种不同 AI 服务任选
- 📝 **灵活配置** - 自定义视频长度、风格、模型
- 📊 **实时进度** - WebSocket 实时推送生成进度
- ⬇️ **视频下载** - 生成完成后下载视频文件
- 📱 **响应式设计** - 完美支持桌面和移动设备
- 🌍 **公网访问** - 可部署到任何云平台

---

## 🚀 5 分钟快速开始

### 方案 A：本地开发（推荐开发者）

```bash
# 1. 克隆项目
git clone https://github.com/13818111859/ImageR.git
cd ImageR

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 Runway/Pika/HeyGen/Synthesia API Keys

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器
# http://localhost:3000
```

### 方案 B：Docker 本地运行

```bash
# 1. 构建镜像
docker build -t ai-video .

# 2. 运行容器
docker run -p 3000:3000 \
  -e RUNWAY_API_KEY=your_key \
  -e PIKA_API_KEY=your_key \
  -e HEYGEN_API_KEY=your_key \
  -e SYNTHESIA_API_KEY=your_key \
  ai-video

# 3. 打开浏览器
# http://localhost:3000
```

---

## 🌍 公网部署指南（推荐方案）

### ⭐ 最简单：Vercel + Render（5 分钟完成）

#### 步骤 1️⃣：部署前端到 Vercel

```bash
# 访问 https://vercel.com
# 1. 用 GitHub 账号登录
# 2. 点击 "New Project"
# 3. 选择 ImageR 仓库
# 4. 点击 Deploy
# ✅ 等待 30 秒，自动获得公网 URL
#    如：https://ai-video.vercel.app
```

#### 步骤 2️⃣：部署后端到 Render

```bash
# 访问 https://render.com
# 1. 点击 "New Web Service"
# 2. 连接 GitHub（选择 ImageR 仓库）
# 3. 配置如下：
#    Build Command: npm install
#    Start Command: node server.js
# 4. 点击 "Create Web Service"
# 5. 添加环境变量（见下方）
# ✅ 等待 3-5 分钟，自动获得后端 URL
#    如：https://ai-video-backend.onrender.com
```

**Render 环境变量配置**（在 Dashboard 中 Environment 标签）：

```
RUNWAY_API_KEY=sk_xxxxxxxxxxxx
PIKA_API_KEY=pk_xxxxxxxxxxxx
HEYGEN_API_KEY=hg_xxxxxxxxxxxx
SYNTHESIA_API_KEY=syn_xxxxxxxxxxxx
DEFAULT_AI_SERVICE=runway
NODE_ENV=production
PORT=3000
```

#### 步骤 3️⃣：连接前后端

编辑本地 `public/video-generator.js`，在文件最顶部添加：

```javascript
// 公网 API 地址（替换为您的 Render 后端 URL）
const API_BASE_URL = 'https://ai-video-backend.onrender.com';

// 修改所有 API 调用（示例）
// 原: fetch('/api/upload', ...)
// 改: fetch(`${API_BASE_URL}/api/upload`, ...)
```

#### 步骤 4️⃣：提交并自动部署

```bash
# 保存修改
git add .
git commit -m "配置公网 API 地址"
git push origin main

# Vercel 会自动检测到更改并重新部署
# ✅ 完成！应用已通过公网访问
# 访问：https://ai-video.vercel.app
```

---

## 🔑 获取 API Keys

### 1️⃣ **Runway AI**

| 步骤 | 操作 |
|------|------|
| 1 | 访问 https://runwayml.com/api |
| 2 | 点击 "Get API Key" |
| 3 | 注册开发者账户 |
| 4 | 在 Dashboard 生成 API Key |
| 5 | 复制到 `.env` 中的 `RUNWAY_API_KEY` |

**官方文档**：https://docs.runwayml.com/

### 2️⃣ **Pika**

| 步骤 | 操作 |
|------|------|
| 1 | 访问 https://pika.art/api |
| 2 | 登录或注册账户 |
| 3 | 进入 API 文档 |
| 4 | 创建 API Key |
| 5 | 复制到 `.env` 中的 `PIKA_API_KEY` |

**官方文档**：https://docs.pika.art/

### 3️⃣ **HeyGen**

| 步骤 | 操作 |
|------|------|
| 1 | 访问 https://www.heygen.com/api |
| 2 | 点击 "Start Free" 或 "Sign In" |
| 3 | 完成注册 |
| 4 | 在 Settings 中申请 API 访问权限 |
| 5 | 获取 API Key 后复制到 `.env` |

**官方文档**：https://docs.heygen.com/

### 4️⃣ **Synthesia**

| 步骤 | 操作 |
|------|------|
| 1 | 访问 https://synthesia.io/api |
| 2 | 点击 "Enterprise" 或 "API" |
| 3 | 注册企业开发者账户 |
| 4 | 申请 API 权限（通常需要 24 小时） |
| 5 | 收到 API Key 后复制到 `.env` |

**官方文档**：https://docs.synthesia.io/

---

## 📁 项目结构

```
ImageR/
├── public/                          # 前端文件
│   ├── index.html                  # 主页面
│   ├── style.css                   # 样式表
│   ├── app.js                      # 原图像编辑器
│   └── video-generator.js          # 视频生成器
├── config/
│   └── ai-services.js              # AI 服务配置
├── services/
│   └── video-generator/            # AI 视频生成服务
│       ├── index.js                # 服务工厂
│       ├── runway.js               # Runway 集成
│       ├── pika.js                 # Pika 集成
│       ├── heygen.js               # HeyGen 集成
│       └── synthesia.js            # Synthesia 集成
├── routes/
│   └── video-api.js                # API 路由
├── uploads/                        # 上传的图片
├── videos/                         # 生成的视频
├── server.js                       # Express 服务器
├── server-updated.js               # 更新版本服务器
├── .env.example                    # 环境变量示例
├── docker-compose.yml              # Docker 编排
├── Dockerfile                      # Docker 配置
├── nginx.conf                      # Nginx 配置
├── package.json                    # 依赖配置
└── README.md                       # 本文件
```

---

## 🔧 环境变量配置

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

然后编辑 `.env`，填入从各个 AI 平台获取的 API Keys：

```env
# 服务器配置
NODE_ENV=production
PORT=3000
API_BASE_URL=http://localhost:3000

# Runway AI API
RUNWAY_API_KEY=sk_xxxxxxxxxxxx
RUNWAY_API_URL=https://api.runwayml.com/v1

# Pika API
PIKA_API_KEY=pk_xxxxxxxxxxxx
PIKA_API_URL=https://api.pika.art/v1

# HeyGen API
HEYGEN_API_KEY=hg_xxxxxxxxxxxx
HEYGEN_API_URL=https://api.heygen.com/v1

# Synthesia API
SYNTHESIA_API_KEY=syn_xxxxxxxxxxxx
SYNTHESIA_API_URL=https://api.synthesia.io/v1

# 默认使用的 AI 服务
DEFAULT_AI_SERVICE=runway
# 可选值: runway, pika, heygen, synthesia

# 日志级别
LOG_LEVEL=info
```

---

## 📚 API 文档

### 获取可用的 AI 服务

```bash
GET /api/video/services

响应:
{
  "success": true,
  "services": [
    {
      "name": "runway",
      "config": {...}
    },
    {
      "name": "pika",
      "config": {...}
    }
  ]
}
```

### 上传图片

```bash
POST /api/video/upload
Content-Type: multipart/form-data

参数:
- image: File (JPEG, PNG, GIF, WebP)

响应:
{
  "success": true,
  "filename": "1234567890-uuid.jpg",
  "path": "/uploads/1234567890-uuid.jpg",
  "size": 1024,
  "mimetype": "image/jpeg"
}
```

### 生成视频

```bash
POST /api/video/generate
Content-Type: application/json

参数:
- prompt: string (必需) - 视频描述，如"一个人在海边走路"
- imageFile: string (可选) - 上传的图片文件名
- duration: number (可选) - 视频时长，单位秒，默认 5
- style: string (可选) - 视频风格，默认 realistic
- service: string (可选) - AI 服务名，可选 runway/pika/heygen/synthesia
- type: string (可选) - 生成类型，默认 text-to-video

响应:
{
  "success": true,
  "taskId": "uuid-xxxx-xxxx",
  "status": "submitted",
  "message": "视频生成已开始"
}
```

### 查询任务进度

```bash
GET /api/video/task/:taskId

响应:
{
  "success": true,
  "task": {
    "id": "uuid-xxxx-xxxx",
    "status": "submitted|processing|completed|failed",
    "progress": 50,
    "videoUrl": "https://...",
    "error": null,
    "createdAt": "2026-05-22T09:00:00Z",
    "updatedAt": "2026-05-22T09:05:00Z"
  }
}
```

### 下载视频

```bash
GET /api/video/download/:filename

响应: 视频文件流（二进制）
```

### 健康检查

```bash
GET /api/video/health

响应:
{
  "success": true,
  "health": {
    "runway": true,
    "pika": false,
    "heygen": true,
    "synthesia": false
  },
  "timestamp": "2026-05-22T09:00:00Z"
}
```

---

## 💻 使用示例

### JavaScript 前端

```javascript
// 1. 上传图片
const formData = new FormData();
formData.append('image', imageFile);

const uploadRes = await fetch('/api/video/upload', {
  method: 'POST',
  body: formData
});
const uploadData = await uploadRes.json();
console.log('上传成功:', uploadData.filename);

// 2. 生成视频
const generateRes = await fetch('/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: '一个人在海边走路，阳光洒落，微风吹动衣服',
    imageFile: uploadData.filename,
    duration: 5,
    style: 'realistic',
    service: 'runway' // 可选：runway, pika, heygen, synthesia
  })
});
const generateData = await generateRes.json();
const taskId = generateData.taskId;

// 3. 轮询进度
const pollProgress = setInterval(async () => {
  const statusRes = await fetch(`/api/video/task/${taskId}`);
  const statusData = await statusRes.json();
  
  console.log(`进度: ${statusData.task.progress}%`);
  
  if (statusData.task.status === 'completed') {
    clearInterval(pollProgress);
    console.log('生成完成！');
    window.location.href = `/api/video/download/${statusData.task.videoUrl}`;
  } else if (statusData.task.status === 'failed') {
    clearInterval(pollProgress);
    alert('生成失败: ' + statusData.task.error);
  }
}, 5000);
```

### Python 调用

```python
import requests
import time

# 上传图片
with open('image.jpg', 'rb') as f:
    upload_res = requests.post(
        'http://localhost:3000/api/video/upload',
        files={'image': f}
    )
upload_data = upload_res.json()
print(f"上传成功: {upload_data['filename']}")

# 生成视频
generate_res = requests.post(
    'http://localhost:3000/api/video/generate',
    json={
        'prompt': '一个人在海边走路',
        'imageFile': upload_data['filename'],
        'duration': 5,
        'style': 'realistic',
        'service': 'runway'
    }
)
generate_data = generate_res.json()
task_id = generate_data['taskId']
print(f"任务已提交: {task_id}")

# 轮询进度
while True:
    status_res = requests.get(f'http://localhost:3000/api/video/task/{task_id}')
    status_data = status_res.json()
    task = status_data['task']
    
    print(f"进度: {task['progress']}%")
    
    if task['status'] == 'completed':
        print(f"完成！视频 URL: {task['videoUrl']}")
        break
    elif task['status'] == 'failed':
        print(f"失败: {task['error']}")
        break
    
    time.sleep(5)
```

---

## 🎯 功能对比表

| 功能 | Runway | Pika | HeyGen | Synthesia |
|------|--------|------|--------|-----------|
| 文本转视频 | ✅ | ✅ | ✅ | ✅ |
| 图片转视频 | ✅ | ✅ | ✅ | ✅ |
| 虚拟主播 | ⚠️ | ⚠️ | ✅ | ✅ |
| 多语言 | ✅ | ✅ | ✅ | ✅ |
| 4K 视频 | ✅ | ⚠️ | ✅ | ✅ |
| 视频长度 | 60秒 | 30秒 | 5分钟 | 10分钟 |
| 价格/分钟 | $0.10 | $0.05 | $0.08 | $0.12 |
| API 易用性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🐛 故障排查

### 问题：API Key 无效

```bash
# 检查 .env 文件
cat .env

# 确保 API Key 格式正确，没有多余空格
# ✅ 正确:
RUNWAY_API_KEY=sk_xxxxxxxxxxxx

# ❌ 错误:
RUNWAY_API_KEY = sk_xxxxxxxxxxxx
```

### 问题：视频生成超时

```bash
# 增加 Node.js 堆内存
NODE_OPTIONS=--max-old-space-size=4096 npm run dev

# 或检查 AI 服务是否可用
curl https://api.runwayml.com/health
```

### 问题：上传文件失败

```bash
# 检查上传目录权限
chmod -R 777 uploads/
chmod -R 777 videos/

# 检查磁盘空间
df -h
```

### 问题：CORS 错误

```bash
# 确保后端配置了 CORS
# 在 server.js 中已包含：
# app.use(cors());
```

---

## 📞 技术支持

- 📖 **完整部署指南**：见本 README 公网部署部分
- 🐛 **问题报告**：[GitHub Issues](https://github.com/13818111859/ImageR/issues)
- 📧 **邮件联系**：13818111859@163.com
- 💬 **社区讨论**：[GitHub Discussions](https://github.com/13818111859/ImageR/discussions)

---

## 🎉 快速检查清单

部署前，请确认以下事项：

- [ ] 从所有 AI 平台获取了 API Keys
- [ ] 配置了 `.env` 文件
- [ ] 本地运行 `npm run dev` 能正常访问
- [ ] 选择了部署方案（推荐 Vercel + Render）
- [ ] 在 Vercel/Render 中配置了环境变量
- [ ] 修改了前端 API 地址为公网后端 URL
- [ ] Git Push 已完成自动部署

---

## 📄 许可证

MIT License

---

## 🌟 致谢

感谢以下 AI 服务平台的支持：

- [Runway ML](https://runwayml.com/)
- [Pika](https://pika.art/)
- [HeyGen](https://www.heygen.com/)
- [Synthesia](https://synthesia.io/)

---

## 🎬 开始使用

```bash
# 1. 克隆项目
git clone https://github.com/13818111859/ImageR.git

# 2. 安装依赖
npm install

# 3. 配置 API Keys
cp .env.example .env
# 编辑 .env

# 4. 启动服务
npm run dev

# 5. 打开浏览器
# http://localhost:3000
```

**祝您使用愉快！** 🎉✨
