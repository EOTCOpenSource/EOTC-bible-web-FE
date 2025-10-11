import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const bibleDataPath = path.join(process.cwd(), "src", "data", "bible-data");
    const files = await fs.readdir(bibleDataPath);

    const oldTestament: any[] = [];
    const newTestament: any[] = [];

    // Read all JSON files and extract book info
    for (const file of files) {
      if (file.endsWith(".json")) {
        const jsonPath = path.join(bibleDataPath, file);
        const fileContent = await fs.readFile(jsonPath, "utf8");
        const bookData = JSON.parse(fileContent);

        const bookId = bookData.book_name_en.replace(/ /g, "-").toLowerCase();
        
        const book = {
          name: bookData.book_name_en,
          nameAm: bookData.book_name_am,
          id: bookId,
          book_number: bookData.book_number,
          testament: bookData.testament
        };

        if (bookData.testament === "old") {
          oldTestament.push(book);
        } else if (bookData.testament === "new") {
          newTestament.push(book);
        }
      }
    }

    // Sort by book_number
    oldTestament.sort((a, b) => a.book_number - b.book_number);
    newTestament.sort((a, b) => a.book_number - b.book_number);

    return Response.json({
      oldTestament,
      newTestament
    });
  } catch (error) {
    console.error("Error reading bible data:", error);
    return Response.json(
      { error: "Failed to read bible books" },
      { status: 500 }
    );
  }
}