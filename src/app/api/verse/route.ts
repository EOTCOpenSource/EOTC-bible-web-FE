import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const bookId = searchParams.get("bookId");
        const chapter = parseInt(searchParams.get("chapter") || "0");
        const verse = parseInt(searchParams.get("verse") || "0");

        if (!bookId || !chapter || !verse) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const bibleDataPath = path.join(process.cwd(), "src", "data", "bible-data");
        const files = await fs.readdir(bibleDataPath);

        const targetFile = files.find(f => {
            // Heuristic to match bookId to filename. 
            // Filenames like "01_Genesis.json". bookId like "genesis" or "1-john".
            // Existing code in api/books/route.ts lowercases and replaces spaces with dashes.
            // So "1 John" -> "1-john". File: "62_1_John.json" => book_name_en: "1 John".
            // We need to match the ID back to the file.
            // Easiest is to read all (cached ideally) or iterate.
            return f.endsWith(".json");
        });

        // Better approach: Since we don't know the file prefix, we might have to scan.
        // Optimization: Cache this mapping? For now, scan.

        let foundBook = null;
        let foundContent = "";

        for (const file of files) {
            if (!file.endsWith(".json")) continue;

            // OPTIMIZATION: Check if filename contains the bookId parts essentially? 
            // No, file names are like "01_Genesis.json".
            // Let's just read and parse for match. It's file IO but acceptable for this scale.

            const jsonPath = path.join(bibleDataPath, file);
            // We can read specific file if we knew the mapping. 
            // Current bookId logic: "genesis".
            // File could be "01_Genesis.json". 
            // Let's try to find file that *contains* the case-insensitive book name if possible, 
            // OR parse them. Parsing 66 small JSONs is fast enough.

            // Actually, checking "01_Genesis.json" includes "Genesis".

            const content = await fs.readFile(jsonPath, "utf8");
            const bookData = JSON.parse(content);
            const currentId = bookData.book_name_en.replace(/ /g, "-").toLowerCase();

            if (currentId === bookId.toLowerCase()) {
                foundBook = bookData;
                break;
            }
        }

        if (!foundBook) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        // Navigate to chapter and verse
        // Structure: bookData.chapters[i].chapter (number) -> sections -> verses
        const chapterData = foundBook.chapters.find((c: any) => c.chapter === chapter);
        if (!chapterData) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        let verseText = "";
        // Verses are nested in sections
        for (const section of chapterData.sections) {
            const v = section.verses.find((v: any) => v.verse === verse);
            if (v) {
                verseText = v.text;
                break;
            }
        }

        if (!verseText) {
            return NextResponse.json({ error: "Verse not found" }, { status: 404 });
        }

        return NextResponse.json({ text: verseText });

    } catch (error) {
        console.error("Error fetching verse:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
