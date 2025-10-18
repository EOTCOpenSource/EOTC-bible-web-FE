'use client';

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

} from "@/components/ui/sidebar";
import { books, type bookType } from "@/data/data";
import { useRouter } from 'next/navigation';
import { useBibleStore } from '@/stores/bibleStore';

export function AppSidebar() {
  const router = useRouter();
  const { current, setCurrent } = useBibleStore();
  const [selectedTestament, setSelectedTestament] = useState<"old" | "new">("old");
=======
} from '@/components/ui/sidebar'
import { books, type bookType } from '@/data/data'
import { useRouter } from 'next/navigation'
import { useBibleStore } from '@/stores/bibleStore'
import { useState, useEffect } from 'react'

export function AppSidebar() {
  const router = useRouter()
  const { current, setCurrent, selectedTestament, setSelectedTestament } = useBibleStore()
  const [isScrolling, setIsScrolling] = useState(false)
  let scrollTimeout: NodeJS.Timeout

  const handleScroll = () => {
    setIsScrolling(true)
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }


  const handleBookClick = (book: bookType) => {
    const newRef = { book: book.book_name_en, chapter: 1, verse: 1 };
    setCurrent(newRef);
    const bookId = book.book_name_en.toLowerCase().replace(/ /g, '-');
    router.push(`/read-online/${bookId}/1`);
  };

  const handleChapterClick = (chapter: number) => {
    const selectedBook = books.find(b => b.book_name_en === current.book);
    if (selectedBook) {
        const bookId = selectedBook.book_name_en.toLowerCase().replace(/ /g, '-');
        const newRef = { book: selectedBook.book_name_en, chapter: chapter, verse: 1 };
        setCurrent(newRef);
        router.push(`/read-online/${bookId}/${chapter}`);
    }
  };

  const filteredBooks = books.filter(
    (book) => book.testament === selectedTestament
  );
  const currentBook = books.find(
    (book) => book.book_name_en === current.book
  );

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
                className={`w-max rounded-none border border-[#C8C8C8] px-2 py-2 text-sm font-medium hover:bg-[#392D2D] hover:text-[#FFFDF8] md:px-3 md:py-3 cursor-pointer ${
                  selectedTestament === 'old'
                    ? 'bg-[#392D2D] text-[#FFFDF8]'
                    : 'bg-[#FFFDF8] text-[#1A1A19]'
                }`}
                onClick={() => {
                  setSelectedTestament("old");
                  const firstOldTestamentBook = books.find(b => b.testament === 'old');
                  if (firstOldTestamentBook) {
                    handleBookClick(firstOldTestamentBook);
                  }
                }}
              >
                Old Testment
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="m-0 w-full p-0">
              <SidebarMenuButton
                className={`w-max rounded-none border border-[#C8C8C8] px-2 py-2 text-sm font-medium hover:bg-[#392D2D] hover:text-[#FFFDF8] md:px-3 md:py-3 cursor-pointer ${
                  selectedTestament === 'new'
                    ? 'bg-[#392D2D] text-[#FFFDF8]'
                    : 'border border-[#C8C8C8] bg-[#FFFDF8] text-[#1A1A19]'
                }`}
                onClick={() => {
                  setSelectedTestament("new");
                  const firstNewTestamentBook = books.find(b => b.testament === 'new');
                  if (firstNewTestamentBook) {
                    handleBookClick(firstNewTestamentBook);
                  }
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
            <div
              className={`custom-scroll col-span-6 h-full overflow-y-auto pr-2 ${
                isScrolling ? 'scrolling' : ''
              }`}
              onScroll={handleScroll}
            >
              <SidebarMenu>
                {filteredBooks.map((book) => (
                  <SidebarMenuItem key={book.book_number}>
                    <SidebarMenuButton
                      className={`rounded-none text-base p-4 py-5 ${
                        current.book === book.book_name_am
                          ? "bg-[#F2EFE8] text-[#1A1A19]"
                          : "bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]"
                      }`}
                      onClick={() => handleBookClick(book)}
                    >
                      {book.book_name_am}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>

            <div className="custom-scroll col-span-2 h-full overflow-hidden overflow-y-auto">

            <div
              className={`custom-scroll col-span-2 h-full overflow-y-auto ${
                isScrolling ? 'scrolling' : ''
              }`}
              onScroll={handleScroll}
            >

              <SidebarMenu>
                {currentBook &&
                  Array.from({ length: currentBook.chapters }, (_, i) => {
                    const chapter = i + 1;
                    const isSelected = current.chapter === chapter;

                    return (
                      <SidebarMenuItem key={chapter} className="mx-1 w-full">
                        <SidebarMenuButton
                          className={`rounded-none p-4 py-5 text-base ${
                            isSelected
                              ? 'bg-[#F2EFE8] text-[#1A1A19]'
                              : 'bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]'
                          }`}
                          onClick={() => handleChapterClick(chapter)}
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