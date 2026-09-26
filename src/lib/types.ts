export interface Tutorial {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  read_time: number
  tags: string[]
  cover_emoji: string
  published: boolean
  created_at: string
  updated_at: string
  view_count?: number
}

export type TutorialInsert = Omit<Tutorial, 'id' | 'created_at' | 'updated_at' | 'view_count'>
export type TutorialUpdate = Partial<TutorialInsert>

export const CATEGORIES = [
  'System Design',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Databases',
  'DevOps',
  'Algorithms',
  'Security',
  'Testing',
] as const

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const
