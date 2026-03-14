// API 基础配置
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'

// 获取 token
const getToken = () => localStorage.getItem('token')

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

export default { projectApi, authApi }
