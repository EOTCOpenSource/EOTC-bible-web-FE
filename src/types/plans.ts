export interface ReadingItem {
    id: string
    day: number
    bookId: string
    bookName: string
    chapter: number
    verseStart?: number
    verseEnd?: number
    title?: string
    description?: string
    isCompleted: boolean
    completedAt?: string
  }
  
  export interface ReadingPlan {
    id: string
    title: string
    description: string
    image: string
    slug: string
    duration: number
    category: string
    author?: string
    totalDays: number
    completedDays: number
    progress: number
    startDate?: string
    endDate?: string
    isEnrolled: boolean
    items: ReadingItem[]
    createdAt: string
    updatedAt: string
  }
  
  export interface PlanProgress {
    planId: string
    itemId: string
    completedAt: string
  }
  
  export interface SimilarPlan {
    id: string
    title: string
    description: string
    image: string
    slug: string
  }
  