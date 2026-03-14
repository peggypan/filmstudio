# 🎬 FilmStudio - AI 影视制作平台

> 一款现代化的 AI-Native 影视制作协作平台，帮助创作者高效完成从剧本到成片的完整 workflow。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg)](https://www.postgresql.org/)

## ✨ 核心功能

### 📝 剧本管理
- 剧本在线编辑与版本控制
- AI 剧本生成（集成 OpenAI GPT-4）
- AI 剧本续写与润色
- 多种剧本格式导出

### 🎨 分镜设计
- 可视化分镜编辑器
- 拖拽式镜头排序
- 分镜图上传与管理
- 镜头参数配置（机位、运镜、时长）

### 🎭 演员管理
- 演员信息库管理
- 头像上传
- 技能标签与联系方式
- 项目角色分配

### 🎵 配乐管理
- 音乐素材库
- 音频文件上传与在线预览
- 版权类型标记
- 按风格/情绪筛选

### 🎙️ 配音合成
- AI 配音生成（集成 ElevenLabs）
- 多音色选择
- 语速/语调调节
- 试听与导出

### 📊 项目管理
- 多项目并行管理
- 项目进度追踪
- 团队协作（未来版本）

## 🏗️ 技术架构

### 前端
- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **UI 库**: Ant Design 5
- **路由**: React Router 6
- **状态**: React Hooks

### 后端
- **框架**: NestJS 10
- **语言**: TypeScript
- **ORM**: Prisma 5
- **数据库**: PostgreSQL
- **认证**: JWT + bcrypt
- **文档**: Swagger/OpenAPI

### AI 集成
- **剧本生成**: OpenAI GPT-4
- **配音合成**: ElevenLabs API
- **图片生成**: Midjourney API（预留）

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 15+
- pnpm 8+ (推荐)

### 1. 克隆项目
```bash
git clone https://github.com/peggypan/filmstudio.git
cd filmstudio
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量

#### 后端配置
```bash
cd apps/api
cp .env.example .env
# 编辑 .env 文件，配置数据库和 API 密钥
```

#### 前端配置
```bash
cd apps/web
cp .env.example .env
# 编辑 .env 文件，配置 API 地址
```

### 4. 数据库迁移
```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed  # 可选：添加示例数据
```

### 5. 启动开发服务器

```bash
# 启动后端（端口 3001）
cd apps/api
pnpm dev

# 启动前端（端口 5173）
cd apps/web
pnpm dev
```

访问 http://localhost:5173 开始使用！

## 📁 项目结构

```
filmstudio/
├── apps/
│   ├── api/              # NestJS 后端
│   │   ├── src/
│   │   │   ├── modules/  # 功能模块
│   │   │   │   ├── auth/         # 认证模块
│   │   │   │   ├── project/      # 项目管理
│   │   │   │   ├── script/       # 剧本管理
│   │   │   │   ├── cast/         # 演员管理
│   │   │   │   ├── music/        # 配乐管理
│   │   │   │   ├── storyboard/   # 分镜管理
│   │   │   │   ├── dubbing/      # 配音合成
│   │   │   │   └── file/         # 文件上传
│   │   │   └── prisma/   # 数据库 Schema
│   │   └── uploads/      # 上传文件存储
│   └── web/              # React 前端
│       └── src/
│           ├── pages/    # 页面组件
│           ├── components/ # 通用组件
│           ├── services/   # API 服务
│           └── types/      # TypeScript 类型
└── packages/             # 共享包（未来扩展）
```

## 🔧 配置说明

### 必需的环境变量

#### 后端 (.env)
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/filmstudio?schema=public"

# JWT 密钥
JWT_SECRET="your-secret-key-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# OpenAI API（用于剧本生成）
OPENAI_API_KEY="sk-..."

# ElevenLabs API（用于配音合成）
ELEVENLABS_API_KEY="..."
```

#### 前端 (.env)
```env
# API 地址
VITE_API_URL="http://localhost:3001"
```

## 📝 API 文档

启动后端服务后，访问 http://localhost:3001/api/docs 查看 Swagger API 文档。

## 🚀 部署

### 前端部署 (Vercel)
```bash
cd apps/web
vercel --prod
```

### 后端部署 (Railway/Render)
1. 连接 GitHub 仓库
2. 设置环境变量
3. 部署自动完成

详见 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 🛣️ 路线图

### MVP (v1.0) ✅
- [x] 用户认证系统
- [x] 项目管理
- [x] 剧本管理 + AI 生成
- [x] 演员管理
- [x] 配乐管理
- [x] 分镜设计器
- [x] 配音合成（预留接口）
- [x] 文件上传

### v1.1 (计划中)
- [ ] 团队协作功能
- [ ] 评论与批注
- [ ] 版本历史
- [ ] 导出 PDF/视频

### v1.2 (未来)
- [ ] 视频剪辑集成
- [ ] 实时协作编辑
- [ ] 移动端 App
- [ ] 团队协作权限管理

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License © 2026 FilmStudio Team

---

<p align="center">
  Made with ❤️ for filmmakers
</p>
