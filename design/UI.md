# 🎨 FilmStudio UI设计规范

## 1. 设计原则

### 1.1 设计关键词
- **专业** - 影视行业的专业感
- **简洁** - 减少干扰，聚焦创作
- **现代** - 跟上时代的设计语言
- **沉浸** - 暗黑模式，沉浸式体验

### 1.2 用户体验目标
- 新用户3分钟内上手
- 常用操作2秒内完成
- 复杂功能有AI辅助

---

## 2. 色彩系统

### 2.1 主色调
```css
:root {
  /* 品牌色 - 电影紫 */
  --brand-primary: #6366F1;
  --brand-primary-light: #818CF8;
  --brand-primary-dark: #4F46E5;
  
  /* 辅助色 */
  --accent-cyan: #06B6D4;      /* AI功能 */
  --accent-amber: #F59E0B;     /* 警告/提醒 */
  --accent-emerald: #10B981;   /* 成功 */
  --accent-rose: #F43F5E;      /* 错误/删除 */
}
```

### 2.2 暗黑主题 (默认)
```css
[data-theme="dark"] {
  /* 背景色 */
  --bg-primary: #0F0F0F;       /* 主背景 */
  --bg-secondary: #1A1A1A;     /* 卡片背景 */
  --bg-tertiary: #262626;      /* 输入框背景 */
  --bg-elevated: #333333;      /* 浮层背景 */
  
  /* 文字色 */
  --text-primary: #FFFFFF;      /* 主文字 */
  --text-secondary: #A1A1AA;    /* 次要文字 */
  --text-tertiary: #71717A;     /* 辅助文字 */
  --text-disabled: #52525B;     /* 禁用文字 */
  
  /* 边框色 */
  --border-primary: #27272A;
  --border-secondary: #3F3F46;
  
  /* 特殊 */
  --surface-glass: rgba(255, 255, 255, 0.05);
  --overlay: rgba(0, 0, 0, 0.8);
}
```

### 2.3 亮色主题
```css
[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F4F4F5;
  --bg-tertiary: #E4E4E7;
  --bg-elevated: #FFFFFF;
  
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --text-tertiary: #A1A1AA;
  --text-disabled: #D4D4D8;
  
  --border-primary: #E4E4E7;
  --border-secondary: #D4D4D8;
}
```

### 2.4 渐变色
```css
/* 品牌渐变 */
--gradient-brand: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* AI功能渐变 */
--gradient-ai: linear-gradient(135deg, #06B6D4 0%, #6366F1 100%);

/* 电影感渐变 */
--gradient-cinematic: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
```

---

## 3. 字体系统

### 3.1 字体族
```css
:root {
  /* 中文 */
  --font-chinese: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  
  /* 英文 */
  --font-english: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 代码 */
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
  
  /* 影视专用 */
  --font-display: "Bebas Neue", "Impact", sans-serif;
}
```

### 3.2 字号规范
```css
:root {
  /* 标题 */
  --text-h1: 2.5rem;      /* 40px - 页面标题 */
  --text-h2: 2rem;        /* 32px - 模块标题 */
  --text-h3: 1.5rem;      /* 24px - 卡片标题 */
  --text-h4: 1.25rem;     /* 20px - 小标题 */
  
  /* 正文 */
  --text-body: 1rem;      /* 16px - 正文 */
  --text-small: 0.875rem; /* 14px - 辅助文字 */
  --text-xs: 0.75rem;     /* 12px - 标签 */
  
  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

---

## 4. 间距系统

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

---

## 5. 圆角系统

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

---

## 6. 阴影系统

```css
:root {
  /* 暗黑模式 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
  
  /* 发光效果 */
  --glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
  --glow-ai: 0 0 30px rgba(6, 182, 212, 0.4);
}
```

---

## 7. 组件规范

### 7.1 按钮 (Button)

#### 主按钮
```css
.btn-primary {
  background: var(--brand-primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--brand-primary-light);
  box-shadow: var(--glow-primary);
}
```

#### AI按钮 (特殊)
```css
.btn-ai {
  background: var(--gradient-ai);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-ai::before {
  content: "✨";
}
.btn-ai:hover {
  box-shadow: var(--glow-ai);
}
```

#### 次要按钮
```css
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
  padding: 12px 24px;
  border-radius: var(--radius-md);
}
```

### 7.2 卡片 (Card)

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
.card-hover:hover {
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 0.3s;
}
```

### 7.3 输入框 (Input)

```css
.input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  color: var(--text-primary);
  transition: all 0.2s;
}
.input:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
}
```

### 7.4 导航 (Navigation)

#### 侧边导航
```css
.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
}
.nav-item {
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.2s;
}
.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.nav-item.active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--brand-primary);
}
```

---

## 8. 页面布局

### 8.1 整体布局
```
┌─────────────────────────────────────────────────────┐
│  Header (60px)                                       │
│  Logo    Search    Notifications    User Avatar      │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │           Main Content                   │
│ (260px)  │           (Fluid)                        │
│          │                                          │
│ - 项目   │                                          │
│ - 剧本   │                                          │
│ - 分镜   │                                          │
│ - 演员   │                                          │
│ - 配音   │                                          │
│ - 配乐   │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  AI Assistant (Floating)                             │
└─────────────────────────────────────────────────────┘
```

### 8.2 项目详情页布局
```
┌─────────────────────────────────────────────────────┐
│  Project Header                                      │
│  项目名称    [编辑] [分享] [设置]                    │
├─────────────────────────────────────────────────────┤
│  Tab Navigation                                      │
│  概览 | 剧本 | 分镜 | 拍摄计划 | 演员 | 资源        │
├─────────────────────────────────────────────────────┤
│                                                      │
│                   Content Area                       │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Quick Actions                                       │
│  [AI生成剧本] [AI生成分镜] [导出]                   │
└─────────────────────────────────────────────────────┘
```

---

## 9. 交互动效

### 9.1 过渡动画
```css
/* 标准过渡 */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;

/* 特殊效果 */
--transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 9.2 动效规范
| 元素 | 动画 | 时长 |
|------|------|------|
| 按钮悬停 | scale(1.02) | 200ms |
| 卡片悬停 | translateY(-4px) + shadow | 300ms |
| 页面切换 | fade + slide | 300ms |
| AI生成 | pulse + shimmer | 1500ms |
| 加载 | spinner | 循环 |
| 成功提示 | scale(0.8→1) + fade | 300ms |

### 9.3 AI生成动效
```css
@keyframes ai-generating {
  0%, 100% { 
    background-position: 0% 50%;
    opacity: 0.8;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 1;
  }
}
.ai-generating {
  background: linear-gradient(
    90deg, 
    var(--brand-primary), 
    var(--accent-cyan), 
    var(--brand-primary)
  );
  background-size: 200% 200%;
  animation: ai-generating 2s ease infinite;
}
```

---

## 10. 图标系统

### 10.1 图标库
- 主要: Lucide React
- 备用: Heroicons

### 10.2 图标尺寸
```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

---

## 11. 模块专属设计

### 11.1 剧本编辑器
- 左侧: 场景列表
- 中间: 剧本编辑区 (富文本)
- 右侧: AI助手 / 角色信息
- 底部: 字数统计、预估时长

### 11.2 分镜编辑器
- 顶部: 工具栏 (镜头类型、AI生成)
- 左侧: 分镜缩略图列表
- 中间: 画布编辑区
- 右侧: 镜头详情面板

### 11.3 配音工作室
- 左侧: 文本输入区
- 中间: 音色选择 (卡片网格)
- 右侧: 参数调节 (语速、音调、情感)
- 底部: 播放控制、导出

### 11.4 演员库
- 顶部: 搜索 + 筛选
- 主体: 演员卡片网格
- 卡片内容: 头像、姓名、标签、档期指示

---

## 12. 响应式断点

```css
/* 桌面 */
@media (min-width: 1280px) { }

/* 平板横屏 */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* 平板竖屏 */
@media (min-width: 768px) and (max-width: 1023px) { }

/* 手机 */
@media (max-width: 767px) { }
```

---

## 13. 设计资源

### 13.1 推荐工具
- 设计: Figma
- 原型: Figma / Framer
- 图标: Lucide / Heroicons
- 插图: Unsplash / Midjourney

### 13.2 待创建文件
- [ ] Figma设计稿
- [ ] 组件库
- [ ] 原型演示
- [ ] 设计规范PDF

---

*文档版本: v1.0*
*更新日期: 2026-03-13*
