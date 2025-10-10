'use client'

import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { books } from '@/data/data'

export function AppSidebar() {
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new'>('old')

  const [selectedBook, setSelectedBook] = useState<number>(() => {
    return 1
  })

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    return 1
  })

  const filteredBooks = books.filter((book) => book.testament === selectedTestament)
  const currentBook = filteredBooks.find((book) => book.book_number === selectedBook)

  return (
    <Sidebar
      className="flex h-screen w-[300px] flex-col overflow-hidden"
      style={
        {
          '--sidebar-width-collapsed': '0px',
          '--sidebar-width': '23rem',
          '--sidebar-width-mobile': '300px',
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="gap-0 p-0">
        <SidebarMenu className="w-full">
          <SidebarGroupContent className="grid w-full grid-cols-[1.1fr_1.15fr_.64fr]">
            <SidebarMenuItem className="m-0 w-full p-0">
              <SidebarMenuButton
                className={`w-max rounded-none border border-[#C8C8C8] px-2 py-2 text-sm font-medium hover:bg-[#392D2D] hover:text-[#FFFDF8] md:px-3 md:py-3 ${
                  selectedTestament === 'old'
                    ? 'bg-[#392D2D] text-[#FFFDF8]'
                    : 'bg-[#FFFDF8] text-[#1A1A19]'
                }`}
                onClick={() => {
                  setSelectedTestament('old')
                  setSelectedBook(1)
                  setSelectedChapter(1)
                }}
              >
                Old Testment
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="m-0 w-full p-0">
              <SidebarMenuButton
                className={`w-max rounded-none border border-[#C8C8C8] px-2 py-2 text-sm font-medium hover:bg-[#392D2D] hover:text-[#FFFDF8] md:px-3 md:py-3 ${
                  selectedTestament === 'new'
                    ? 'bg-[#392D2D] text-[#FFFDF8]'
                    : 'border border-[#C8C8C8] bg-[#FFFDF8] text-[#1A1A19]'
                }`}
                onClick={() => {
                  setSelectedTestament('new')
                  setSelectedBook(55) // Matthew
                  setSelectedChapter(1)
                }}
              >
                New Testment
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="m-0 flex items-center rounded-none border-y-1 border-[#C8C8C8] bg-[#FFFDF8] px-2 text-sm font-medium text-[#1A1A19]">
              Chapters
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col overflow-hidden bg-[#FFFDF8]">
        <SidebarGroup className="overflow-hidden p-2">
          <SidebarGroupContent className="grid h-full grid-cols-8">
            <div className="custom-scroll col-span-6 h-full overflow-y-auto pr-2">
              <SidebarMenu>
                {filteredBooks.map((book) => (
                  <SidebarMenuItem key={book.book_number}>
                    <SidebarMenuButton
                      className={`rounded-none p-4 py-5 text-base ${
                        selectedBook === book.book_number
                          ? 'bg-[#F2EFE8] text-[#1A1A19]'
                          : 'bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]'
                      }`}
                      onClick={() => {
                        setSelectedBook(book.book_number)
                        setSelectedChapter(1)
                      }}
                    >
                      {book.book_name_en}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
            <div className="custom-scroll col-span-2 h-full overflow-y-auto">
              <SidebarMenu>
                {currentBook &&
                  Array.from({ length: currentBook.chapters }, (_, i) => {
                    const chapter = i + 1
                    const isSelected = selectedChapter === chapter

                    return (
                      <SidebarMenuItem key={chapter} className="mx-1 w-full">
                        <SidebarMenuButton
                          className={`rounded-none p-4 py-5 text-base ${
                            isSelected
                              ? 'bg-[#F2EFE8] text-[#1A1A19]'
                              : 'bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]'
                          }`}
                          onClick={() => setSelectedChapter(chapter)}
                        >
                          {chapter}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
