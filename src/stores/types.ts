//defining types that will be used in the stores

export type BookId = string; // E.g., "gen", "exo", "psa"...

export interface VerseRef {
  book: BookId;
  chapter: number;
  verse: number;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  fontSize: number;
  lastOpenedChapter?: {
    book: BookId;
    chapter: number;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  settings?: Settings;
}

export interface Note {
  _id: string;
  verseRef: VerseRef;
  content: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}

export type HighlightColor = "yellow" | "green" | "pink" | "blue";

export interface Highlight {
  _id: string;
  verseRef: VerseRef;
  color: HighlightColor;
  createdAt: string;
}

export interface BookMark {
  _id: string;
  verseRef: VerseRef;
  createdAt: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastDate?: string;
}

export interface Progress {
  chaptersRead: Record<BookId, number[]>;
  streak: Streak;
  lastRead?: VerseRef;
}
