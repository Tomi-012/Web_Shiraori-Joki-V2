export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioItem {
  id: string
  title: string
  category: 'genshin' | 'honkai' | 'other'
  type: 'build' | 'clear' | 'farm' | 'exploration' | 'party' | 'other'
  image: string
  description?: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  popular?: boolean
}