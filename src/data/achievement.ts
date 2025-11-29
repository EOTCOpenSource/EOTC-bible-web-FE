export type achievementType = {
     bookName: string
     chapter: number
     status: "Completed" | "NotStarted"
}

export const achievements: achievementType[] = [
     {
          bookName: "Matthew",
          chapter: 7,
          status:"Completed"
     },
     {
          bookName: "Psalms",
          chapter: 22,
          status:"Completed"
     },
     {
          bookName: "Luke",
          chapter: 22,
          status:"NotStarted"
     },
     {
          bookName: "Genesis",
          chapter: 9,
          status:"NotStarted"
     },     
]