import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

async function getBookData(bookId: string) {
  const bibleDataPath = path.join(process.cwd(), "src", "data", "bible-data");
  try {
    const files = await fs.readdir(bibleDataPath);
    for (const file of files) {
      const bookNameFromFile = file.replace(/^\d+-/, "").replace(/\.json$/, "");
      if (bookNameFromFile.replace(/ /g, "-") === bookId) {
        const jsonPath = path.join(bibleDataPath, file);
        const fileContent = await fs.readFile(jsonPath, "utf8");
        return JSON.parse(fileContent);
      }
    }
  } catch (error) {
    console.error("Could not read bible data:", error);
  }
  return null;
}

export default async function ReaderPage({
  params,
}: {
  params: { bookId: string; chapter: string };
}) {
  const { bookId, chapter } = params;
  const bookData = await getBookData(bookId);

  if (!bookData) {
    return <div>Book not found</div>;
  }

  const chapterData = bookData.chapters.find(
    (c: any) => c.chapter === parseInt(chapter)
  );

  if (!chapterData) {
    return <div>Chapter not found</div>;
  }

  const currentChapter = parseInt(chapter);
  const totalChapters = bookData.chapters.length;
  const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
  const nextChapter =
    currentChapter < totalChapters ? currentChapter + 1 : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {prevChapter ? (
        <Link
          href={`/read-online/${bookId}/${prevChapter}`}
          className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      ) : (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-6 w-6" />
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          {bookData.book_name_am + " " + chapter}
        </h1>

        <div className="max-w-md mx-auto">
          {chapterData.sections.map(
            (section: any, sectionIndex: number) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="text-lg sm:text-xl font-bold mt-4 mb-2 text-center">
                    {section.title}
                  </h3>
                )}
                <div className="text-base sm:text-lg text-center">
                  {section.verses.map((verse: any) => (
                    <span key={verse.verse}>
                      <sup className="text-xs sm:text-xs md:text-xs mr-1">
                        {verse.verse}
                      </sup>
                      <span>{verse.text} </span>
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {nextChapter ? (
        <Link
          href={`/read-online/${bookId}/${nextChapter}`}
          className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-6 w-6" />
        </Link>
      ) : (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed">
          <ChevronRight className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
