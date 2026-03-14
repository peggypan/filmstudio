# ============================================
# FilmStudio API Dockerfile
# ============================================

FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY apps/api ./apps/api
COPY prisma ./prisma

# 生成 Prisma Client
RUN cd apps/api && npx prisma generate

# 构建应用
RUN cd apps/api && pnpm build

# ============================================
# 生产阶段
# ============================================

FROM node:20-alpine AS production

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma

# 创建上传目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "apps/api/dist/main.js"]
