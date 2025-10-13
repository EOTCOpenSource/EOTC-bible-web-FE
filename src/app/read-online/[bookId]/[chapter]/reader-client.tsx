"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";
import { VerseActionsMenu } from "@/components/reader/VerseActionsMenu";

interface ReaderClientProps {
  bookData: any;
  chapterData: any;
  prevChapter: number | null;
  nextChapter: number | null;
  bookId: string;
}

export default function ReaderClient({
  bookData,
  chapterData,
  prevChapter,
  nextChapter,
  bookId,
}: ReaderClientProps) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div className="relative w-full h-full">
      {prevChapter ? (
        <Link
          href={`/read-online/${bookId}/${prevChapter}`}
          className={clsx(
            "fixed top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
            "left-4", // Mobile specific
            isSidebarOpen ? "md:left-[474px]" : "md:left-64" // Desktop specific
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      ) : (
        <div
          className={clsx(
            "fixed top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed",
            "left-4", // Default for mobile
            isSidebarOpen ? "md:left-[474px]" : "md:left-64" // Desktop specific
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          {bookData.book_name_am + " " + chapterData.chapter}
        </h1>

        <div className="max-w-md mx-auto">
          {chapterData.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="text-lg sm:text-xl font-bold mt-4 mb-2 text-center">
                  {section.title}
                </h3>
              )}
              <div className="text-base sm:text-lg text-center">
                {section.verses.map((verse: any) => (
                  <span key={verse.verse} className="inline-flex items-start gap-1 group">
                    <sup className="text-xs sm:text-xs md:text-xs mr-1">
                      {verse.verse}
                    </sup>
                    <span>{verse.text} </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <VerseActionsMenu verseNumber={verse.verse} verseText={verse.text} />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {nextChapter ? (
        <Link
          href={`/read-online/${bookId}/${nextChapter}`}
          className={clsx(
            "fixed top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
            "right-4", // Mobile specific
            "md:right-64" // Desktop specific, always maintain sidebar closed position
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </Link>
      ) : (
        <div
          className={clsx(
            "fixed top-1/2 -translate-y-1/2 z-10 p-2 rounded-md bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed",
            "right-4", // Mobile specific
            "md:right-64" // Desktop specific, always maintain sidebar closed position
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
