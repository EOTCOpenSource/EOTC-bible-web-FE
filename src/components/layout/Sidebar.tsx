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
      className="h-screen flex flex-col w-[300px] overflow-hidden "
      style={
        {
          "--sidebar-width-collapsed": "0px",
          "--sidebar-width": "23rem",
          "--sidebar-width-mobile": "300px",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className=" gap-0 p-0">
        <SidebarMenu className="w-full">
          <SidebarGroupContent className="grid grid-cols-[1.1fr_1.15fr_.64fr] w-full">
            <SidebarMenuItem className="p-0  m-0 w-full">
              <SidebarMenuButton
                className={`py-2 px-2 w-max md:py-3 md:px-3 rounded-none hover:bg-[#392D2D] hover:text-[#FFFDF8] font-medium border border-[#C8C8C8] text-sm
                                ${
                                  selectedTestament === "old"
                                    ? "bg-[#392D2D] text-[#FFFDF8]"
                                    : "bg-[#FFFDF8]  text-[#1A1A19] "
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
                className={`py-2 w-max px-2 md:py-3 md:px-3 rounded-none hover:bg-[#392D2D] hover:text-[#FFFDF8] font-medium border border-[#C8C8C8] text-sm
                                ${
                                  selectedTestament === "new"
                                    ? "bg-[#392D2D] text-[#FFFDF8]"
                                    : "bg-[#FFFDF8]  text-[#1A1A19] border border-[#C8C8C8] "
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
            <SidebarMenuItem className="px-2 m-0 bg-[#FFFDF8] border-y-1 border-[#C8C8C8] font-medium text-[#1A1A19] rounded-none text-sm flex items-center">
              Chapters
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="  flex flex-col overflow-hidden bg-[#FFFDF8]">
        <SidebarGroup className="  overflow-hidden p-2"> 
          <SidebarGroupContent className="grid grid-cols-8 h-full">
            <div className="custom-scroll col-span-6 pr-2 h-full overflow-y-auto">
              <SidebarMenu>
                {filteredBooks.map((book) => (
                  <SidebarMenuItem key={book.book_number}>
                    <SidebarMenuButton
                      className={`rounded-none text-base p-4 py-5 ${
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
            <div className="custom-scroll col-span-2 overflow-y-auto h-full">
              <SidebarMenu>
                {currentBook &&
                  Array.from({ length: currentBook.chapters }, (_, i) => {
                    const chapter = i + 1;
                    const isSelected = selectedChapter === chapter;

                    return (
                      <SidebarMenuItem key={chapter} className="mx-1 w-full">
                        <SidebarMenuButton
                          className={`rounded-none text-base p-4 py-5 ${
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
