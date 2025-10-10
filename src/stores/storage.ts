import { PersistStorage } from 'zustand/middleware'

export const createBrowserStorage = <T = unknown>(keyPrefix = ''): PersistStorage<T> => {
  return {
    getItem: async (name) => {
      if (typeof window === 'undefined') return null
      try {
        const value = localStorage.getItem(`${keyPrefix}${name}`)
        return value ? JSON.parse(value) : null
      } catch (err) {
        console.error('Error reading from local storage', err)
        return null
      }
    },
    setItem: async (name, value) => {
      if (typeof window === 'undefined') return
      try {
        localStorage.setItem(`${keyPrefix}${name}`, JSON.stringify(value))
      } catch (err) {
        console.error('Error writing to local storage', err)
      }
    },
    removeItem: async (name) => {
      if (typeof window === 'undefined') return
      try {
        localStorage.removeItem(`${keyPrefix}${name}`)
      } catch (err) {
        console.error('Error removing from local storage', err)
      }
    },
  }
}
