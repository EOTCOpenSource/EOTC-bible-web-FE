"use client";

import { useEffect, useState, useMemo } from "react";
import { books as allBooks } from "@/data/data";

interface Book {
  book_number: number;
  book_name_am: string;
  book_short_name_am: string;
  book_name_en: string;
  book_short_name_en: string;
  testament: string;
  chapters: number;
}

export const useBibleData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    
    setBooks(allBooks);
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchTerm) {
      return books;
    }
    return books.filter((book) =>
      book.book_name_en.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  return {
    books,
    filteredBooks,
    setSearchTerm,
  };
};
