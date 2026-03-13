# 🚀 GitHub 仓库设置指南

## 第一步：在 GitHub 上创建仓库

1. 登录 GitHub: https://github.com
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - **Repository name**: `filmstudio` (或你喜欢的名字)
   - **Description**: 🎬 AI驱动的影视制作管理平台 - AI-powered film production management platform
   - **Visibility**: Public (推荐) 或 Private
   - **Initialize**: ❌ 不要勾选 (我们已经有本地仓库了)
4. 点击 **Create repository**

## 第二步：关联本地仓库到 GitHub

创建仓库后，GitHub 会显示类似下面的命令：

```bash
# 在你的本地项目目录中执行
cd /path/to/filmstudio

# 添加远程仓库 (替换 yourusername 为你的GitHub用户名)
git remote add origin https://github.com/yourusername/filmstudio.git

# 推送代码
git branch -M main
git push -u origin main
```

## 第三步：验证推送

```bash
# 查看远程仓库
git remote -v

# 应该显示：
# origin  https://github.com/yourusername/filmstudio.git (fetch)
# origin  https://github.com/yourusername/filmstudio.git (push)
```

## 第四步：GitHub 配置 (可选但推荐)

### 设置 Secrets (用于CI/CD)
1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 secrets:
   - `OPENAI_API_KEY` - OpenAI API密钥
   - `ELEVENLABS_API_KEY` - ElevenLabs API密钥
   - `DATABASE_URL` - 数据库连接字符串
   - `JWT_SECRET` - JWT密钥

### 启用 GitHub Pages (文档托管)
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / docs

### 添加 Topics
在仓库页面右侧添加 topics:
- `film-production`
- `ai`
- `video-production`
- `storyboard`
- `voice-synthesis`
- `react`
- `typescript`

## 第五步：邀请协作者

1. Settings → Manage access
2. Invite a collaborator
3. 输入协作者GitHub用户名或邮箱

---

## 📋 后续开发工作流

### 日常开发
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature/xxx

# 3. 开发和提交
git add .
git commit -m "feat: xxx"

# 4. 推送分支
git push origin feature/xxx

# 5. 在GitHub上创建Pull Request
# 6. Code Review 后合并到 main
```

### 提交信息规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关

例如:
feat: 添加AI剧本生成功能
fix: 修复分镜编辑器拖拽bug
docs: 更新API文档
```

---

## 🎯 创建完GitHub仓库后告诉我

我会继续：
1. ✅ 推送代码到GitHub
2. ✅ 设置GitHub Actions CI/CD
3. ✅ 创建 Issue 模板
4. ✅ 开始编写前端代码

---

*创建时间: 2026-03-13*
