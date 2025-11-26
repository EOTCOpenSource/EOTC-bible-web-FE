import type { UserProfile } from '@/types/api'

export const userMock: UserProfile =  {
     id: 'mock-id',
     name: 'Guest',
     email: 'guest@example.com',
     settings: {
          theme: 'dark',
          fontSize: 16,
          lastRead: {
               bookId: "bookId",
               chapter: 4
          }
     },
     streak: {
          current: 3,
          longest: 7,
          lastDate: "string"
     }    
}