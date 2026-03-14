export interface Music {
  id: string
  title: string
  artist?: string
  style?: string
  duration?: number
  license?: 'free' | 'paid' | 'royalty-free' | 'commercial'
  url: string
  cover?: string
  tags?: string[]
  projectId?: string
  project?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  uploaderId: string
  uploader?: {
    id: string
    name: string
  }
}

export interface CreateMusicRequest {
  title: string
  artist?: string
  style?: string
  duration?: number
  license?: string
  tags?: string[]
  url?: string
  projectId?: string
}

export interface UpdateMusicRequest {
  title?: string
  artist?: string
  style?: string
  duration?: number
  license?: string
  tags?: string[]
}
