'use client'

import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'eotc-bible-offline'
const DB_VERSION = 1
const BOOKS_STORE = 'books'
const META_STORE = 'meta'

interface BookRecord {
  bookId: string
  data: any
  downloadedAt: number
  sizeBytes: number
  version: string // for auto-update checks
}

interface MetaRecord {
  key: string
  value: any
}

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (typeof window === 'undefined') return null
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(BOOKS_STORE)) {
          db.createObjectStore(BOOKS_STORE, { keyPath: 'bookId' })
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

/**
 * Save a book's full JSON data to IndexedDB
 */
export async function saveBookData(bookId: string, data: any, version = '1.0'): Promise<void> {
  const db = await getDb()
  if (!db) return

  const jsonString = JSON.stringify(data)
  const sizeBytes = new Blob([jsonString]).size

  const record: BookRecord = {
    bookId,
    data,
    downloadedAt: Date.now(),
    sizeBytes,
    version,
  }

  await db.put(BOOKS_STORE, record)
}

// Retrieve a book's data from IndexedDB
export async function getBookData(bookId: string): Promise<any | null> {
  const db = await getDb()
  if (!db) return null

  const record = (await db.get(BOOKS_STORE, bookId)) as BookRecord | undefined
  return record?.data ?? null
}

/**
 * Get full record including metadata
 */
export async function getBookRecord(bookId: string): Promise<BookRecord | null> {
  const db = await getDb()
  if (!db) return null

  const record = (await db.get(BOOKS_STORE, bookId)) as BookRecord | undefined
  return record ?? null
}

/**
 * Delete a single book from IndexedDB
 */
export async function deleteBookData(bookId: string): Promise<void> {
  const db = await getDb()
  if (!db) return
  await db.delete(BOOKS_STORE, bookId)
}

/**
 * Get all cached book IDs
 */
export async function getAllCachedBookIds(): Promise<string[]> {
  const db = await getDb()
  if (!db) return []
  return db.getAllKeys(BOOKS_STORE) as Promise<string[]>
}

/**
 * Get all cached book records (for storage usage calculation)
 */
export async function getAllCachedRecords(): Promise<BookRecord[]> {
  const db = await getDb()
  if (!db) return []
  return db.getAll(BOOKS_STORE) as Promise<BookRecord[]>
}

/**
 * Get total storage used by all cached books
 */
export async function getTotalStorageUsed(): Promise<number> {
  const records = await getAllCachedRecords()
  return records.reduce((sum, r) => sum + r.sizeBytes, 0)
}

/**
 * Clear all offline data
 */
export async function clearAllOfflineData(): Promise<void> {
  const db = await getDb()
  if (!db) return
  await db.clear(BOOKS_STORE)
  await db.clear(META_STORE)
}

/**
 * Save metadata (e.g. data version for auto-update)
 */
export async function setMeta(key: string, value: any): Promise<void> {
  const db = await getDb()
  if (!db) return
  await db.put(META_STORE, { key, value } as MetaRecord)
}

// Get metadata
export async function getMeta(key: string): Promise<any | null> {
  const db = await getDb()
  if (!db) return null
  const record = (await db.get(META_STORE, key)) as MetaRecord | undefined
  return record?.value ?? null
}
