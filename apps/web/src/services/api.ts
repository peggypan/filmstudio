// API 基础配置
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'

// 从 localStorage 获取 token（zustand persist 存储的位置）
const getToken = () => {
  const authData = localStorage.getItem('filmstudio-auth')
  if (authData) {
    const parsed = JSON.parse(authData)
    return parsed.state?.token || null
  }
  return null
}

// 通用请求函数
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// 项目 API
export const projectApi = {
  // 获取项目列表
  getProjects: () => fetchApi<any[]>('/projects'),
  
  // 获取项目详情
  getProject: (id: string) => fetchApi<any>(`/projects/${id}`),
  
  // 创建项目
  createProject: (data: { name: string; description?: string }) =>
    fetchApi<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 更新项目
  updateProject: (id: string, data: Partial<{ name: string; description: string; status: string; progress: number }>) =>
    fetchApi<any>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  // 删除项目
  deleteProject: (id: string) =>
    fetchApi<any>(`/projects/${id}`, {
      method: 'DELETE',
    }),
}

// 认证 API
export const authApi = {
  // 登录
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string; refresh_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  // 注册
  register: (data: { email: string; password: string; name?: string }) =>
    fetchApi<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 获取当前用户
  getMe: () => fetchApi<any>('/auth/me'),
}

// 剧本 API
export const scriptApi = {
  // 获取剧本列表
  getScripts: () => fetchApi<any[]>('/scripts'),
  
  // 获取剧本详情
  getScript: (id: string) => fetchApi<any>(`/scripts/${id}`),
  
  // 创建剧本
  createScript: (data: { title: string; content?: string; genre?: string; projectId?: string }) =>
    fetchApi<any>('/scripts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 更新剧本
  updateScript: (id: string, data: Partial<{ title: string; content: string; genre: string; status: string }>) =>
    fetchApi<any>(`/scripts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  // 删除剧本
  deleteScript: (id: string) =>
    fetchApi<any>(`/scripts/${id}`, {
      method: 'DELETE',
    }),
  
  // AI 生成剧本
  generateScript: (data: { prompt: string; genre?: string; projectId?: string }) =>
    fetchApi<{ title: string; content: string }>('/scripts/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// 演员 API
export const castApi = {
  // 获取演员列表
  getCasts: () => fetchApi<any[]>('/cast'),
  
  // 获取演员详情
  getCast: (id: string) => fetchApi<any>(`/cast/${id}`),
  
  // 创建演员
  createCast: (data: { name: string; type: string; bio?: string; contact?: string; email?: string; phone?: string; skills?: string[] }) =>
    fetchApi<any>('/cast', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 更新演员
  updateCast: (id: string, data: Partial<{ name: string; type: string; bio: string; contact: string; email: string; phone: string; skills: string[] }>) =>
    fetchApi<any>(`/cast/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  // 删除演员
  deleteCast: (id: string) =>
    fetchApi<any>(`/cast/${id}`, {
      method: 'DELETE',
    }),
}

// 配乐 API
export const musicApi = {
  // 获取音乐列表
  getMusic: () => fetchApi<any[]>('/music'),

  // 获取音乐详情
  getMusicById: (id: string) => fetchApi<any>(`/music/${id}`),

  // 创建音乐记录
  createMusic: (data: { title: string; artist?: string; style?: string; duration?: number; license?: string; tags?: string[]; projectId?: string }) =>
    fetchApi<any>('/music', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新音乐
  updateMusic: (id: string, data: Partial<{ title: string; artist: string; style: string; duration: number; license: string; tags: string[] }>) =>
    fetchApi<any>(`/music/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 删除音乐
  deleteMusic: (id: string) =>
    fetchApi<any>(`/music/${id}`, {
      method: 'DELETE',
    }),
}

// 分镜 API
export const storyboardApi = {
  // 获取分镜列表
  getStoryboards: () => fetchApi<any[]>('/storyboard'),

  // 获取分镜详情
  getStoryboard: (id: string) => fetchApi<any>(`/storyboard/${id}`),

  // 创建分镜
  createStoryboard: (data: { title: string; projectId: string; frames?: any[] }) =>
    fetchApi<any>('/storyboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新分镜
  updateStoryboard: (id: string, data: Partial<{ title: string; frames: any[] }>) =>
    fetchApi<any>(`/storyboard/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 删除分镜
  deleteStoryboard: (id: string) =>
    fetchApi<any>(`/storyboard/${id}`, {
      method: 'DELETE',
    }),

  // 添加镜头
  addFrame: (storyboardId: string, data: any) =>
    fetchApi<any>(`/storyboard/${storyboardId}/frames`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 删除镜头
  deleteFrame: (storyboardId: string, frameId: string) =>
    fetchApi<any>(`/storyboard/${storyboardId}/frames/${frameId}`, {
      method: 'DELETE',
    }),

  // 更新镜头
  updateFrame: (storyboardId: string, frameId: string, data: any) =>
    fetchApi<any>(`/storyboard/${storyboardId}/frames/${frameId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}

// 配音 API
export const dubbingApi = {
  // 获取配音列表
  getDubbings: () => fetchApi<any[]>('/dubbing'),

  // 获取配音详情
  getDubbing: (id: string) => fetchApi<any>(`/dubbing/${id}`),

  // 创建配音
  createDubbing: (data: { title: string; text: string; voiceId: string; projectId?: string; castId?: string }) =>
    fetchApi<any>('/dubbing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新配音
  updateDubbing: (id: string, data: Partial<{ title: string; text: string; voiceId: string }>) =>
    fetchApi<any>(`/dubbing/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 删除配音
  deleteDubbing: (id: string) =>
    fetchApi<any>(`/dubbing/${id}`, {
      method: 'DELETE',
    }),

  // 生成配音（调用 ElevenLabs）
  generateDubbing: (id: string) =>
    fetchApi<any>(`/dubbing/${id}/generate`, {
      method: 'POST',
    }),

  // 获取可用音色列表
  getVoices: () => fetchApi<any[]>('/dubbing/voices'),
}

export default { projectApi, authApi, scriptApi, castApi, musicApi, storyboardApi, dubbingApi }
