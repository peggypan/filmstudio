# 🏗️ FilmStudio 架构设计文档

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Web App   │  │  Mobile App │  │   Desktop App       │ │
│  │  (React)    │  │  (React Native)│  │  (Electron)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API 网关层                              │
│              (Nginx / Kong / AWS API Gateway)               │
│                   限流 | 认证 | 路由                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      业务服务层                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  用户服务    │ │  剧本服务   │ │    分镜服务         │   │
│  │  User Svc   │ │ Script Svc  │ │  Storyboard Svc    │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  演员服务    │ │  配音服务   │ │    配乐服务         │   │
│  │  Actor Svc  │ │  Voice Svc  │ │   Music Svc        │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  项目服务    │ │  文件服务   │ │    AI服务          │   │
│  │ Project Svc │ │  File Svc   │ │    AI Svc          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据层                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  PostgreSQL │ │    Redis    │ │   MinIO/S3         │   │
│  │  (主数据库)  │ │   (缓存)    │ │   (文件存储)        │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Elasticsearch│ │   RabbitMQ  │ │   Vector DB        │   │
│  │  (搜索)      │ │  (消息队列)  │ │   (向量数据库)      │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI能力层                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   OpenAI    │ │  Claude     │ │    文心一言         │   │
│  │   GPT-4     │ │  (Anthropic)│ │    (百度)          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Midjourney│ │Stable Diffusion│ │  ElevenLabs    │   │
│  │  (图像生成)  │ │   (图像生成)  │ │  (语音合成)       │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术栈选择

### 2.1 前端技术栈

```yaml
framework: React 18
language: TypeScript
state_management: 
  - Zustand (全局状态)
  - React Query (服务端状态)
  - React Hook Form (表单状态)
routing: React Router v6
ui_components:
  - Ant Design 5.x (基础组件)
  - Chakra UI (可选)
  - Framer Motion (动画)
styling:
  - Tailwind CSS (实用类)
  - Styled Components (组件样式)
charts: 
  - ECharts (数据可视化)
  - D3.js (自定义图表)
editor:
  - Slate.js / TipTap (富文本编辑器)
  - Fabric.js (画布编辑器)
```

### 2.2 后端技术栈

```yaml
runtime: Node.js 18+
framework: NestJS
language: TypeScript
orm: Prisma
database:
  primary: PostgreSQL 14+
  cache: Redis 7+
  search: Elasticsearch 8+
  vector: Pinecone / Weaviate
message_queue: RabbitMQ / Bull Queue
file_storage: MinIO (私有化) / AWS S3
realtime: Socket.io / WebRTC
```

### 2.3 AI服务技术栈

```yaml
llm:
  - OpenAI GPT-4 (主要)
  - Claude 3 (备选)
  - 文心一言 4.0 (中文优化)
image_generation:
  - Midjourney API
  - Stable Diffusion XL
  - DALL-E 3
tts:
  - ElevenLabs (高质量)
  - Azure TTS (备选)
  - 阿里云TTS (中文优化)
embedding:
  - OpenAI text-embedding-3
  - 百度Embedding-V1
```

## 3. 数据库设计

### 3.1 核心实体关系

```
User ||--o{ Project : creates
User ||--o{ Script : writes
User ||--o{ Actor : manages
User ||--o{ Voice : uses

Project ||--|| Script : contains
Project ||--o{ Storyboard : has
Project ||--o{ Actor : casts
Project ||--o{ Music : uses
Project ||--o{ VoiceClip : generates
Project ||--o{ Task : tracks

Script ||--o{ Scene : contains
Scene ||--o{ StoryboardFrame : visualizes

Actor ||--o{ ActorMedia : has
Actor ||--o{ Role : plays

Music ||--o{ MusicTag : tagged
```

### 3.2 核心表结构

#### 用户表 (User)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- admin, editor, viewer
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 项目表 (Project)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- short_film, commercial, documentary, etc.
  status VARCHAR(50) DEFAULT 'planning', -- planning, shooting, post, completed
  owner_id UUID REFERENCES users(id),
  budget DECIMAL(15, 2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 剧本表 (Script)
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  content JSONB, -- 结构化剧本内容
  raw_text TEXT, -- 原始文本
  format VARCHAR(50) DEFAULT 'standard', -- standard, av_script
  version INTEGER DEFAULT 1,
  word_count INTEGER,
  estimated_duration INTEGER, -- 预估时长(秒)
  ai_analysis JSONB, -- AI分析结果
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 场景表 (Scene)
```sql
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  scene_number INTEGER NOT NULL,
  heading VARCHAR(255), -- INT. CAFE - DAY
  location VARCHAR(255),
  time_of_day VARCHAR(100),
  description TEXT,
  characters TEXT[], -- 出场角色
  props TEXT[], -- 道具
  estimated_duration INTEGER,
  emotion_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 演员表 (Actor)
```sql
CREATE TABLE actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(50),
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  bio TEXT,
  skills TEXT[],
  languages TEXT[],
  contact_info JSONB,
  availability JSONB, -- 档期
  media_urls TEXT[],
  ai_embedding VECTOR(1536), -- 用于AI匹配
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 分镜表 (Storyboard)
```sql
CREATE TABLE storyboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  scene_id UUID REFERENCES scenes(id),
  frame_number INTEGER NOT NULL,
  description TEXT,
  shot_type VARCHAR(100), -- wide, medium, close_up, etc.
  camera_movement VARCHAR(100),
  duration INTEGER, -- 镜头时长
  reference_image TEXT,
  ai_generated_image TEXT,
  dialog TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 配音表 (Voice)
```sql
CREATE TABLE voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(50),
  age_group VARCHAR(50), -- child, young, middle, senior
  language VARCHAR(50),
  accent VARCHAR(100),
  emotion VARCHAR(100),
  style VARCHAR(100), -- professional, casual, dramatic, etc.
  preview_url TEXT,
  provider VARCHAR(100), -- elevenlabs, azure, aliyun
  provider_voice_id VARCHAR(255),
  is_custom BOOLEAN DEFAULT FALSE, -- 是否为用户克隆声音
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 配音片段表 (VoiceClip)
```sql
CREATE TABLE voice_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  voice_id UUID REFERENCES voices(id),
  text TEXT NOT NULL,
  audio_url TEXT,
  duration INTEGER,
  emotion_settings JSONB,
  speed DECIMAL(3,2) DEFAULT 1.0,
  pitch DECIMAL(3,2) DEFAULT 1.0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 音乐表 (Music)
```sql
CREATE TABLE music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  genre VARCHAR(100),
  mood TEXT[], -- happy, sad, epic, romantic, etc.
  tempo VARCHAR(50),
  duration INTEGER,
  file_url TEXT,
  waveform_data JSONB,
  license_type VARCHAR(100),
  tags TEXT[],
  ai_embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. API 设计

### 4.1 RESTful API 规范

```yaml
base_url: /api/v1
authentication: Bearer Token
content_type: application/json

# 用户相关
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
PUT    /auth/me

# 项目相关
GET    /projects
POST   /projects
GET    /projects/:id
PUT    /projects/:id
DELETE /projects/:id
GET    /projects/:id/stats

# 剧本相关
GET    /projects/:id/script
POST   /projects/:id/script
PUT    /projects/:id/script
POST   /projects/:id/script/analyze      # AI分析剧本
POST   /projects/:id/script/breakdown    # AI分解剧本
POST   /projects/:id/script/generate     # AI生成剧本

# 分镜相关
GET    /projects/:id/storyboard
POST   /projects/:id/storyboard
GET    /projects/:id/storyboard/:frameId
PUT    /projects/:id/storyboard/:frameId
DELETE /projects/:id/storyboard/:frameId
POST   /projects/:id/storyboard/generate # AI生成分镜
POST   /projects/:id/storyboard/export   # 导出分镜

# 演员相关
GET    /actors
POST   /actors
GET    /actors/:id
PUT    /actors/:id
DELETE /actors/:id
POST   /actors/search                    # 搜索演员
POST   /actors/match                     # AI匹配演员
GET    /actors/:id/availability

# 配音相关
GET    /voices                           # 获取音色列表
POST   /voices/clone                     # 克隆声音
POST   /voices/synthesize                # 合成语音
GET    /projects/:id/voice-clips
POST   /projects/:id/voice-clips

# 音乐相关
GET    /music
POST   /music/search                     # 搜索音乐
POST   /music/recommend                  # AI推荐音乐
GET    /music/:id

# AI服务
POST   /ai/generate-script
POST   /ai/generate-storyboard
POST   /ai/generate-music
POST   /ai/analyze-scene
```

### 4.2 WebSocket 事件

```javascript
// 实时协作
collaboration:join    // 加入协作
collaboration:leave   // 离开协作
collaboration:update  // 内容更新
collaboration:cursor  // 光标位置

// 任务通知
task:assigned         // 任务分配
task:completed        // 任务完成
task:comment          // 任务评论

// 系统通知
notification:new      // 新通知
notification:read     // 通知已读
```

## 5. AI 服务架构

### 5.1 AI 服务流程

```
用户请求
    │
    ▼
┌─────────────┐
│  请求路由    │──→ 判断AI服务类型
└─────────────┘
    │
    ├────────→ 剧本生成 ──→ GPT-4 / 文心一言
    ├────────→ 分镜生成 ──→ GPT-4 + DALL-E 3
    ├────────→ 演员匹配 ──→ Embedding + 向量搜索
    ├────────→ 配乐推荐 ──→ Embedding + 情绪分析
    └────────→ 语音合成 ──→ ElevenLabs / Azure TTS
```

### 5.2 Prompt 管理

```typescript
// prompts/script-generate.ts
export const scriptGeneratePrompt = {
  system: `你是一位专业的影视编剧，擅长创作各类剧本。
请根据用户提供的创意brief，生成一份专业的剧本。
剧本需要包含：场景标题、动作描述、对话、角色提示。`,
  
  user: (brief: ScriptBrief) => `
创意类型：${brief.type}
主题：${brief.theme}
目标时长：${brief.duration}分钟
目标受众：${brief.audience}
风格要求：${brief.style}
关键元素：${brief.elements.join(', ')}

请生成剧本：
`
};

// prompts/storyboard-generate.ts
export const storyboardGeneratePrompt = {
  system: `你是一位资深分镜师，擅长将剧本转化为视觉分镜。
请根据剧本场景，生成详细的分镜描述，包括：镜头类型、运镜方式、画面构图。`,
  
  user: (scene: Scene) => `
场景：${scene.heading}
描述：${scene.description}
对话：${scene.dialog}

请生成5-8个分镜画面描述：
`
};
```

## 6. 安全设计

### 6.1 认证授权
- JWT Token + Refresh Token
- OAuth 2.0 (Google, GitHub, WeChat)
- RBAC 权限模型

### 6.2 数据安全
- 敏感字段加密存储 (AES-256)
- API 请求签名
- 文件访问签名URL
- SQL注入防护 (Prisma ORM)
- XSS防护

### 6.3 AI安全
- 输入过滤 (Prompt Injection防护)
- 输出审核 (内容安全)
- 请求限流
- 成本监控

## 7. 性能优化

### 7.1 前端优化
- 代码分割 (Code Splitting)
- 图片懒加载 + WebP格式
- 虚拟滚动 (长列表)
- 状态持久化 (localStorage)
- Service Worker 缓存

### 7.2 后端优化
- 数据库索引优化
- 查询缓存 (Redis)
- 数据库连接池
- API 响应压缩
- CDN 加速静态资源

### 7.3 AI优化
- 请求合并 (Batch)
- 结果缓存
- 异步处理
- 降级策略

---

*文档版本: v1.0*
*更新日期: 2026-03-13*
