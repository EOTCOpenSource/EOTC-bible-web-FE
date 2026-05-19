import { promises as fs } from 'fs'
import path from 'path'
import { books } from '@/data/data'

export async function GET(_request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params

  try {
    const bookMeta = books.find((b) => b.book_name_en.replace(/ /g, '-').toLowerCase() === bookId)

    if (!bookMeta) {
      return Response.json({ error: 'Book not found' }, { status: 404 })
    }

    const bibleDataPath = path.join(process.cwd(), 'src', 'data', 'bible-data')
    const files = await fs.readdir(bibleDataPath)

    for (const file of files) {
      if (file.includes(bookMeta.file_name)) {
        const jsonPath = path.join(bibleDataPath, file)
        const fileContent = await fs.readFile(jsonPath, 'utf8')
        const bookData = JSON.parse(fileContent)

        return Response.json({
          data: bookData,
          version: '1.0', // increment when bible data is updated
          bookId,
        })
      }
    }

    return Response.json({ error: 'Book data file not found' }, { status: 404 })
  } catch (error) {
    console.error('Error reading book data:', error)
    return Response.json({ error: 'Failed to read book data' }, { status: 500 })
  }
}
