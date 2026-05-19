import { books } from '@/data/data'

export async function GET() {
  try {
    const oldTestament: any[] = []
    const newTestament: any[] = []

    for (const book of books) {
      const bookId = book.book_name_en.replace(/ /g, '-').toLowerCase()

      const entry = {
        name: book.book_name_en,
        nameAm: book.book_name_am,
        id: bookId,
        book_number: book.book_number,
        testament: book.testament,
      }

      if (book.testament === 'old') {
        oldTestament.push(entry)
      } else if (book.testament === 'new') {
        newTestament.push(entry)
      }
    }

    // Sort by book_number
    oldTestament.sort((a, b) => a.book_number - b.book_number)
    newTestament.sort((a, b) => a.book_number - b.book_number)

    return Response.json({
      oldTestament,
      newTestament,
    })
  } catch (error) {
    console.error('Error reading bible data:', error)
    return Response.json({ error: 'Failed to read bible books' }, { status: 500 })
  }
}
