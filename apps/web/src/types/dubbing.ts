export interface Dubbing {
  id: string
  title: string
  text: string
  voiceId: string
  voiceName?: string
  audioUrl?: string
  duration?: number
  projectId?: string
  project?: {
    id: string
    name: string
  }
  castId?: string
  cast?: {
    id: string
    name: string
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface Voice {
  id: string
  name: string
  gender: 'male' | 'female' | 'neutral'
  language: string
  previewUrl?: string
  description?: string
}

export interface CreateDubbingRequest {
  title: string
  text: string
  voiceId: string
  projectId?: string
  castId?: string
}

export interface UpdateDubbingRequest {
  title?: string
  text?: string
  voiceId?: string
}
