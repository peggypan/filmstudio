# FilmStudio 部署指南

本文档介绍如何将 FilmStudio 部署到生产环境。

## 📋 部署方式选择

### 方式一：Vercel + Railway（推荐）
- 前端：Vercel（免费，自动部署）
- 后端：Railway（免费额度足够）
- 数据库：Railway PostgreSQL

### 方式二：Docker Compose（自托管）
- 适合有服务器的用户
- 一键启动所有服务

### 方式三：Render（全免费）
- 前端：Render Static Site
- 后端：Render Web Service
- 数据库：Render PostgreSQL

---

## 🚀 方式一：Vercel + Railway

### 1. 部署后端到 Railway

#### 1.1 准备
- 注册 [Railway](https://railway.app) 账号
- 连接 GitHub 仓库

#### 1.2 创建项目
1. 在 Railway Dashboard 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `filmstudio` 仓库

#### 1.3 添加 PostgreSQL
1. 点击 "New" → "Database" → "Add PostgreSQL"
2. 等待数据库创建完成
3. 在数据库的 "Connect" 标签页获取 `DATABASE_URL`

#### 1.4 配置环境变量
在 Railway 项目 Settings → Variables 中添加：

```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Railway 会自动注入
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key
OPENAI_API_KEY=sk-...  # 可选
ELEVENLABS_API_KEY=...  # 可选
```

#### 1.5 配置构建命令
在 Settings → Deploy 中设置：
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm run start:prod`

#### 1.6 部署
点击 "Deploy" 开始部署。

记录你的 Railway 域名（如 `https://filmstudio-api.up.railway.app`）

### 2. 部署前端到 Vercel

#### 2.1 准备
- 注册 [Vercel](https://vercel.com) 账号
- 连接 GitHub 仓库

#### 2.2 导入项目
1. 点击 "Add New Project"
2. 选择 `filmstudio` 仓库
3. 点击 "Import"

#### 2.3 配置构建设置
- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: 保持默认
- **Output Directory**: `dist`

#### 2.4 配置环境变量
在 Environment Variables 中添加：

```
VITE_API_URL=https://your-railway-domain.up.railway.app
```

#### 2.5 部署
点击 "Deploy" 开始部署。

---

## 🐳 方式二：Docker Compose

### 前提条件
- 服务器已安装 Docker 和 Docker Compose
- 服务器内存至少 2GB

### 部署步骤

```bash
# 1. 克隆项目
git clone https://github.com/peggypan/filmstudio.git
cd filmstudio

# 2. 配置环境变量
cp apps/api/.env.example apps/api/.env
# 编辑 .env 文件，设置 JWT_SECRET 等

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f api

# 5. 执行数据库迁移
docker-compose exec api npx prisma migrate deploy
```

访问 http://your-server-ip:3001 查看 API。

### 配置 Nginx 反向代理（推荐）

```nginx
server {
    listen 80;
    server_name api.filmstudio.app;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /path/to/filmstudio/uploads/;
    }
}
```

---

## 🎨 方式三：Render

### 3.1 部署 PostgreSQL
1. 在 Render Dashboard 创建 "PostgreSQL"
2. 记录连接信息

### 3.2 部署后端
1. 创建 "Web Service"
2. 连接 GitHub 仓库
3. 设置：
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`
4. 添加环境变量（同 Railway）

### 3.3 部署前端
1. 创建 "Static Site"
2. 连接 GitHub 仓库
3. 设置：
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. 添加环境变量 `VITE_API_URL`

---

## ✅ 部署后检查清单

- [ ] 后端 API 可访问（访问 `/api/docs` 查看 Swagger）
- [ ] 前端可正常加载
- [ ] 注册/登录功能正常
- [ ] 文件上传功能正常
- [ ] 数据库连接正常

## 🔒 安全建议

1. **修改默认 JWT 密钥**：使用随机生成的长字符串
2. **启用 HTTPS**：生产环境必须使用 HTTPS
3. **数据库安全**：不要暴露数据库端口到公网
4. **API 密钥**：妥善保管 OpenAI 和 ElevenLabs API Key
5. **文件上传**：建议添加文件类型和大小限制

## 🐛 故障排查

### 数据库连接失败
```bash
# 检查 PostgreSQL 是否运行
docker-compose ps

# 查看数据库日志
docker-compose logs db
```

### 前端无法连接后端
- 检查 `VITE_API_URL` 是否正确
- 检查后端 CORS 配置
- 检查浏览器控制台网络请求

### 文件上传失败
- 检查 `UPLOAD_DIR` 目录权限
- 检查磁盘空间

---

有问题？提交 [Issue](https://github.com/peggypan/filmstudio/issues) 获取帮助。
