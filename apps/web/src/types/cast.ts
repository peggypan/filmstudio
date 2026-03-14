export interface Cast {
  id: string
  name: string
  type: 'actor' | 'voice' | 'model' | 'other'
  avatar?: string
  bio?: string
  contact?: string
  email?: string
  phone?: string
  skills?: string[]
  projects?: {
    id: string
    name: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface CreateCastRequest {
  name: string
  type: string
  avatar?: string
  bio?: string
  contact?: string
  email?: string
  phone?: string
  skills?: string[]
}

export interface UpdateCastRequest {
  name?: string
  type?: string
  avatar?: string
  bio?: string
  contact?: string
  email?: string
  phone?: string
  skills?: string[]
}
