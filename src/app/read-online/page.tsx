"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Book {
  name: string;
  nameAm: string;
  id: string;
  book_number: number;
  testament: string;
}

function BookLink({ book }: { book: Book }) {
  return (
    <Link
      href={`/read-online/${book.id}/1`}
      className="block px-4 py-3 text-gray-900 dark:text-gray-200 bg-white dark:bg-[#1f090a] hover:bg-gray-50 dark:hover:bg-[#4a1c1e] transition-colors border border-gray-200 dark:border-[#521c1f] rounded-md"
    >
      {book.name}
    </Link>
  );
}

function TestamentSection({ title, bookList }: { title: string; bookList: Book[] }) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-yellow-600 dark:text-[#C59B4E] font-serif text-2xl">❖</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {bookList.map((book) => (
          <BookLink key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default function ReadOnlinePage() {
  const [oldTestament, setOldTestament] = useState<Book[]>([]);
  const [newTestament, setNewTestament] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setOldTestament(data.oldTestament);
        setNewTestament(data.newTestament);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded hover:bg-gray-900 dark:hover:bg-gray-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#FFFDF8] dark:bg-[#321315] p-6 sm:p-8 md:p-12 mb-reverse">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Online EOTC Bible
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Explore the Ethiopian Bible with 81 books. <br className="hidden sm:block" /> Choose a book to start reading.
          </p>
        </div>

        {/* Testament Sections - Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Testament Section */}
          {oldTestament.length > 0 && (
            <TestamentSection 
              title="Old Testament" 
              bookList={oldTestament} 
            />
          )}

          {/* New Testament Section */}
          {newTestament.length > 0 && (
            <TestamentSection 
              title="New Testament" 
              bookList={newTestament} 
            />
          )}
        </div>
      </div>
    </div>
  );
}