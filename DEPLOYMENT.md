# 🚀 公网部署完整指南

## ✅ 当前状态

您的项目已准备好部署到公网！以下是 **最快的 3 种方式**：

---

## 📱 方案 1：GitHub Pages（⭐ 最简单，5 分钟）

### 仅适用于**纯前端部分**（无后端 API）

由于您的项目包含 Node.js 后端，GitHub Pages 无法直接部署完整应用。

**但可以部署静态网站版本：**

```bash
# 1. 在项目根目录创建 build 脚本
mkdir -p dist

# 2. 复制前端文件到 dist
cp -r public/* dist/

# 3. 提交到 GitHub
git add .
git commit -m "准备 GitHub Pages 部署"
git push origin main

# 4. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source → Deploy from a branch → main
# 选择 /root 或 /docs
```

**限制**：只能访问前端页面，无法调用后端 API

---

## 🎯 方案 2：Vercel + Render（⭐⭐⭐ 推荐，5 分钟）

这是**最完整的解决方案**，可以部署完整的前后端应用。

### 步骤 1️⃣：前端部署到 Vercel

```bash
# 方法 A：通过网页（推荐）
# 1. 访问 https://vercel.com
# 2. 点击 "Sign Up" → 用 GitHub 登录
# 3. 点击 "New Project"
# 4. 导入仓库 "ImageR"
# 5. 点击 "Deploy"
# ✅ 等待 1-2 分钟
# 获得 URL：https://imager-xxx.vercel.app
```

或者通过命令行：

```bash
# 方法 B：CLI 方式
npm install -g vercel
vercel
# 按提示操作
```

### 步骤 2️⃣：后端部署到 Render

```bash
# 访问 https://render.com
# 1. 点击 "Sign Up" → 用 GitHub 登录
# 2. 点击 "New Web Service"
# 3. 连接仓库（ImageR）
# 4. 配置如下：
#    - Name: ai-video-backend
#    - Root Directory: ./
#    - Build Command: npm install
#    - Start Command: node server.js
# 5. 添加环境变量（见下方）
# 6. 点击 "Create Web Service"
# ✅ 等待 5-10 分钟
# 获得 URL：https://ai-video-backend.onrender.com
```

**环境变量配置**（Render Dashboard → Environment）：

```env
RUNWAY_API_KEY=sk_xxxxxxxxxxxx
PIKA_API_KEY=pk_xxxxxxxxxxxx
HEYGEN_API_KEY=hg_xxxxxxxxxxxx
SYNTHESIA_API_KEY=syn_xxxxxxxxxxxx
DEFAULT_AI_SERVICE=runway
NODE_ENV=production
PORT=3000
```

### 步骤 3️⃣：连接前后端

编辑 `public/video-generator.js`，在最顶部添加：

```javascript
// 🌐 公网 API 地址（替换为您的 Render 后端 URL）
const API_BASE_URL = 'https://ai-video-backend.onrender.com';

// 然后修改所有 API 调用，例如：

// 原代码：
// const response = await fetch('/api/upload', {

// 修改为：
// const response = await fetch(`${API_BASE_URL}/api/upload`, {
```

### 步骤 4️⃣：推送并自动部署

```bash
git add .
git commit -m "配置公网 API 地址"
git push origin main

# ✅ Vercel 自动检测变化并重新部署
# 等待 1-2 分钟即可访问
```

### ✅ 部署完成！

```
🎉 前端：https://imager-xxx.vercel.app
🎉 后端：https://ai-video-backend.onrender.com
🎉 可通过 https://imager-xxx.vercel.app 访问完整应用
```

---

## 🌍 方案 3：云服务器部署（阿里云/腾讯云）

### 推荐配置

| 平台 | 配置 | 价格 | 速度 |
|------|------|------|------|
| 阿里云 ECS | 2核 2GB | ¥62/月 | 🔥🔥 |
| 腾讯云 CVM | 2核 2GB | ¥50/月 | 🔥🔥 |
| AWS EC2 | t3.small | $11/月 | 🔥 |

### 阿里云部署步骤

```bash
# 1. 购买 ECS 实例（推荐 Ubuntu 22.04）
# https://www.aliyun.com/product/ecs

# 2. SSH 连接到服务器
ssh -i your_key.pem ubuntu@your_server_ip

# 3. 安装 Node.js 和 npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # 验证

# 4. 克隆项目
git clone https://github.com/13818111859/ImageR.git
cd ImageR

# 5. 安装依赖
npm install

# 6. 配置环境变量
cat > .env << EOF
NODE_ENV=production
PORT=3000
RUNWAY_API_KEY=sk_xxxxxxxxxxxx
PIKA_API_KEY=pk_xxxxxxxxxxxx
HEYGEN_API_KEY=hg_xxxxxxxxxxxx
SYNTHESIA_API_KEY=syn_xxxxxxxxxxxx
DEFAULT_AI_SERVICE=runway
EOF

# 7. 启动应用（使用 PM2）
npm install -g pm2
pm2 start server.js --name "ai-video"
pm2 startup
pm2 save

# 8. 配置 Nginx 反向代理
sudo apt-get install -y nginx
sudo cat > /etc/nginx/sites-available/default << EOF
server {
    listen 80;
    server_name your_server_ip;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo systemctl restart nginx

# ✅ 访问：http://your_server_ip
```

---

## 📊 三种方案对比

| 对比项 | Vercel + Render | 云服务器 | GitHub Pages |
|--------|-----------------|---------|-------------|
| 难度 | ⭐ | ⭐⭐⭐ | ⭐ |
| 成本 | 免费 | ¥50-60/月 | 免费 |
| 部署速度 | 5 分钟 | 30 分钟 | 2 分钟 |
| 国内访问速度 | 中等 | 🔥🔥（最快） | 快 |
| 国际访问速度 | 🔥（最快） | 中等 | 快 |
| 完整功能 | ✅ | ✅ | ❌（仅前端） |
| 维护难度 | 简单 | 复杂 | 简单 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |

---

## 🎯 快速决策树

```
您想要什么？
│
├─ 📱 纯前端（仅演示页面）
│  └─ 使用 GitHub Pages ✅
│
├─ 🌐 完整应用（前后端都要）
│  ├─ 想要最简单？
│  │  └─ 使用 Vercel + Render ✅ 【推荐】
│  │
│  └─ 想要最快速（国内）？
│     └─ 使用 阿里云/腾讯云 ECS ✅
│
└─ 💰 想要最便宜？
   └─ 使用 Vercel + Render（免费）✅ 【推荐】
```

---

## ✅ 当前项目状态

```
✅ 前端代码已完成
✅ 后端代码已完成  
✅ AI 服务集成已完成
✅ Docker 配置已完成
✅ 环境变量配置已准备
✅ GitHub 仓库已上传

⏳ 等待您选择部署方案并获取 API Keys
```

---

## 🔑 获取 API Keys（必需）

在部署前，必须从 4 个 AI 平台获取 API Keys：

### 1. Runway AI
```bash
访问: https://runwayml.com/api
1. 点击 "Get API Key"
2. 注册开发者账户
3. 复制 API Key → 粘贴到 .env
RUNWAY_API_KEY=sk_xxxxxxxxxxxx
```

### 2. Pika
```bash
访问: https://pika.art/api
1. 登录账户
2. 进入 API 设置
3. 复制 API Key → 粘贴到 .env
PIKA_API_KEY=pk_xxxxxxxxxxxx
```

### 3. HeyGen
```bash
访问: https://www.heygen.com/api
1. 注册开发者账户
2. 申请 API 访问权限
3. 复制 API Key → 粘贴到 .env
HEYGEN_API_KEY=hg_xxxxxxxxxxxx
```

### 4. Synthesia
```bash
访问: https://synthesia.io/api
1. 创建企业账户
2. 申请 API 权限（24 小时审批）
3. 复制 API Key → 粘贴到 .env
SYNTHESIA_API_KEY=syn_xxxxxxxxxxxx
```

---

## 🚀 立即开始部署

### 选项 A：Vercel + Render（推荐 ⭐⭐⭐⭐⭐）

**预计时间：5 分钟**

```bash
# 步骤 1：获取 API Keys（10 分钟）
# 从上面 4 个平台分别获取 API Keys

# 步骤 2：部署前端到 Vercel（1 分钟）
访问 https://vercel.com
→ GitHub 登录
→ Import ImageR 仓库
→ Deploy
✅ 获得前端 URL

# 步骤 3：部署后端到 Render（3 分钟）
访问 https://render.com
→ GitHub 登录
→ New Web Service
→ 选择 ImageR 仓库
→ 配置环境变量
→ Deploy
✅ 获得后端 URL

# 步骤 4：连接前后端（1 分钟）
编辑 public/video-generator.js
修改 API 地址为后端 URL
git push

# 完成！✅
```

### 选项 B：自建云服务器（推荐中国用户）

**预计时间：30 分钟**

```bash
# 购买云服务器
# 推荐：阿里云 ECS（2核 2GB）¥62/月

# 按照上面 "方案 3" 的步骤部署
```

---

## 📝 部署检查清单

部署前请确认：

- [ ] ✅ 已从 GitHub 克隆项目
- [ ] ✅ 已从 4 个 AI 平台获取 API Keys
- [ ] ✅ 已配置 `.env` 文件
- [ ] ✅ 已本地测试 `npm run dev`
- [ ] ✅ 已选择部署方案（推荐 Vercel + Render）
- [ ] ✅ 已在部署平台创建账户
- [ ] ✅ 已配置环境变量
- [ ] ✅ 已修改前端 API 地址
- [ ] ✅ 已 push 到 GitHub

---

## 📞 遇到问题？

| 问题 | 解决方案 |
|------|--------|
| API Key 无效 | 检查 `.env` 文件，确保没有多余空格 |
| 后端无法连接 | 检查 Render 应用是否 running，查看日志 |
| CORS 错误 | 确保后端已配置 CORS 中间件 |
| 视频生成超时 | 增加轮询超时时间，检查 AI 服务状态 |
| 磁盘满 | 清理 `uploads/` 和 `videos/` 目录 |

---

## 🎉 完成后会拥有

```
✅ 公网 URL（全球可访问）
✅ 完整的前后端应用
✅ 4 种 AI 视频生成服务
✅ 自动 HTTPS/SSL
✅ 实时进度监控
✅ 高性能 CDN
✅ 24/7 运行
```

---

## 🌟 推荐流程

```
1. 获取 API Keys（10 分钟）
   ↓
2. 部署到 Vercel + Render（5 分钟）
   ↓
3. 修改配置文件（1 分钟）
   ↓
4. Git Push（1 分钟）
   ↓
5. 测试应用（2 分钟）
   ↓
✅ 完成！应用已在公网上线
```

**总计：约 20 分钟**

---

**立即开始部署吧！** 🚀

选择方案 → 获取 API Keys → 按照步骤操作 → 完成！

有问题？查看完整 README：https://github.com/13818111859/ImageR
