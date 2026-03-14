export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  progress: number
  createdAt: string
  updatedAt: string
  ownerId: string
  owner?: {
    id: string
    name: string
    email: string
  }
}

export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  status?: string
  progress?: number
}
