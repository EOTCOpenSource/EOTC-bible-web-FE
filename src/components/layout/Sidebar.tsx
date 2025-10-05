"use client";

import { useState } from "react";
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
import { books } from "@/data/data";

export function AppSidebar() {
  const [selectedTestament, setSelectedTestament] = useState<"old" | "new">(
    "old"
  );

  const [selectedBook, setSelectedBook] = useState<number>(() => {
    return 1;
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    return 1;
  });

  const filteredBooks = books.filter(
    (book) => book.testament === selectedTestament
  );
  const currentBook = filteredBooks.find(
    (book) => book.book_number === selectedBook
  );

  return (
    <Sidebar
      className="h-screen"
      style={
        {
          "--sidebar-width-collapsed": "0px",
          "--sidebar-width": "23rem",
          "--sidebar-width-mobile": "400px",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="gap-0 p-0">
        <SidebarMenu className="flex-row justify-between items-centre gap-0 ">
          <SidebarMenuItem className="p-0 m-0 w-full">
            <SidebarMenuButton
              className={`py-4 px-4 rounded-none font-medium border-y-1 border-[#C8C8C8] text-base
                              ${
                                selectedTestament === "old"
                                  ? "bg-[#392D2D] text-[#FFFDF8]"
                                  : "bg-[#FFFDF8]  text-[#1A1A19] hover:bg-[#392D2D] hover:text-[#FFFDF8]"
                              }`}
              onClick={() => {
                setSelectedTestament("old");
                setSelectedBook(1);
                setSelectedChapter(1);
              }}
            >
              Old Testment
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="p-0 m-0 w-full">
            <SidebarMenuButton
              className={`py-3 px-3 md:py-4 md:px-4 rounded-none font-medium border border-[#C8C8C8] text-base
                              ${
                                selectedTestament === "new"
                                  ? "bg-[#392D2D] text-[#FFFDF8]"
                                  : "bg-[#FFFDF8]  text-[#1A1A19] border border-[#C8C8C8] hover:bg-[#392D2D] hover:text-[#FFFDF8]"
                              }`}
              onClick={() => {
                setSelectedTestament("new");
                setSelectedBook(55); // Matthew
                setSelectedChapter(1);
              }}
            >
              New Testment
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-4 m-0 bg-[#FFFDF8] border-y-1 border-[#C8C8C8] font-medium text-[#1A1A19] rounded-none text-sm flex  items-center">
            Chapters
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex-1 flex flex-col overflow-hidden bg-[#FFFDF8]">
        <SidebarGroup className="flex-1 overflow-hidden p-0">
          <SidebarGroupContent className="grid grid-cols-[2fr_0.67fr] h-full">
            <div className="custom-scroll h-full overflow-y-auto p-4">
              <SidebarMenu>
                {filteredBooks.map((book) => (
                  <SidebarMenuItem key={book.book_number}>
                    <SidebarMenuButton
                      className={`rounded-[4px] text-base ${
                        selectedBook === book.book_number
                          ? "bg-[#F2EFE8] text-[#1A1A19]"
                          : "bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]"
                      }`}
                      onClick={() => {
                        setSelectedBook(book.book_number);
                        setSelectedChapter(1);
                      }}
                    >
                      {book.book_name_en}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
            <div className="custom-scroll overflow-y-auto h-full py-4 px-2">
              <SidebarMenu>
                {currentBook &&
                  Array.from({ length: currentBook.chapters }, (_, i) => {
                    const chapter = i + 1;
                    const isSelected = selectedChapter === chapter;

                    return (
                      <SidebarMenuItem key={chapter}>
                        <SidebarMenuButton
                          className={`rounded-[4px] text-base ${
                            isSelected
                              ? "bg-[#F2EFE8] text-[#1A1A19]"
                              : "bg-[#FFFDF6] hover:bg-[#F2EFE8] hover:text-[#1A1A19]"
                          }`}
                          onClick={() => setSelectedChapter(chapter)}
                        >
                          {chapter}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
