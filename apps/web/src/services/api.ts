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

export default { projectApi, authApi, scriptApi }
