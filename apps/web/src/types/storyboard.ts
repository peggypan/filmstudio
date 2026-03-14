export interface Storyboard {
  id: string
  title: string
  projectId: string
  project?: {
    id: string
    name: string
  }
  frames: StoryboardFrame[]
  createdAt: string
  updatedAt: string
}

export interface StoryboardFrame {
  id: string
  order: number
  imageUrl?: string
  description?: string
  shotType?: 'wide' | 'medium' | 'close' | 'extreme-close' | 'aerial'
  duration?: number
  cameraMovement?: 'static' | 'pan' | 'tilt' | 'zoom' | 'track' | 'handheld'
  notes?: string
}

export interface CreateStoryboardRequest {
  title: string
  projectId: string
  frames?: StoryboardFrame[]
}

export interface UpdateStoryboardRequest {
  title?: string
  frames?: StoryboardFrame[]
}

export interface CreateFrameRequest {
  description?: string
  shotType?: string
  duration?: number
  cameraMovement?: string
  notes?: string
}
