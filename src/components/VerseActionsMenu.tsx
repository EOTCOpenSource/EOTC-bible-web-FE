"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { VerseRef } from "@/stores/types"; // Assuming VerseRef is defined here

interface VerseActionsMenuProps {
  verseRef: VerseRef;
  // Add any other props needed for positioning or visibility control
}

export default function VerseActionsMenu({ verseRef }: VerseActionsMenuProps) {
  const handleBookmark = () => {
    console.log("Bookmark clicked for", verseRef);
    // Implement bookmark logic using useBookmarksStore
  };

  const handleHighlight = () => {
    console.log("Highlight clicked for", verseRef);
    // Implement highlight logic using useHighlightsStore
  };

  const handleAddNote = () => {
    console.log("Add Note clicked for", verseRef);
    // Implement add note logic using useNotesStore
  };

  const handleCopyVerse = () => {
    const verseText = `[${verseRef.book} ${verseRef.chapter}:${verseRef.verse}]`; // Placeholder for actual verse text
    navigator.clipboard.writeText(verseText);
    console.log("Verse copied:", verseText);
  };

  const handleShareVerse = () => {
    console.log("Share verse clicked for", verseRef);
    // Implement sharing logic
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-white border border-gray-200 rounded-md shadow-lg">
      <Button variant="ghost" size="sm" onClick={handleBookmark}>
        Bookmark
      </Button>
      <Button variant="ghost" size="sm" onClick={handleHighlight}>
        Highlight
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddNote}>
        Add Note
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCopyVerse}>
        Copy Verse
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShareVerse}>
        Share Verse
      </Button>
    </div>
  );
}
