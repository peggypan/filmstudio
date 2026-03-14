export interface Script {
  id: string
  title: string
  content: string
  genre?: string
  status: 'draft' | 'completed' | 'archived'
  projectId?: string
  project?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  authorId: string
  author?: {
    id: string
    name: string
    email: string
  }
  aiGenerated?: boolean
  aiPrompt?: string
}

export interface CreateScriptRequest {
  title: string
  content?: string
  genre?: string
  projectId?: string
}

export interface UpdateScriptRequest {
  title?: string
  content?: string
  genre?: string
  status?: string
}

export interface GenerateScriptRequest {
  prompt: string
  genre?: string
  projectId?: string
}
