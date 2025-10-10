import React from 'react'
import { Heart, Sun, ArrowUpRight, Bookmark, Send } from 'lucide-react'

const VerseOfTheDay = () => {
  return (
    <section className="bg-[#FFFBF5] py-20">
      <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
        <div className="w-full md:w-1/2 md:pr-12">
          <div className="mb-4 flex items-center">
            <Sun className="mr-3 text-amber-500" size={32} />
            <h2 className="text-3xl font-bold text-amber-900">Verse of The Day</h2>
          </div>
          <p className="text-xl leading-relaxed text-gray-700">
            But those who hope in the LORD will renew their strength. They will soar on wings like
            eagles; they will run and not grow weary, they will walk and not be faint.
          </p>
          <p className="mt-4 font-semibold text-amber-800">— Isaiah 40:31 (NIV)</p>
          <div className="mt-8 flex items-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2 rounded-sm border bg-red-100/50 p-2">
              <Heart size={20} />
              <span>105.3k</span>
            </div>
            <div className="flex items-center space-x-2 rounded-sm border bg-red-100/50 p-2">
              <Send size={20} />
              <span>12.8k</span>
            </div>
            <div className="flex items-center space-x-2 rounded-sm border bg-red-100/50 p-2">
              <Bookmark size={20} />
              <span>45.9k</span>
            </div>
          </div>
          <div className="mt-10 flex space-x-4">
            <button className="flex items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white">
              <span>Continue Reading</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
                <ArrowUpRight size={20} />
              </div>
            </button>
            <button className="flex items-center space-x-2 rounded-lg border border-red-900 bg-white py-2 pr-2 pl-6 text-red-900">
              <span>VOTD Archive</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-red-900 p-1 text-white">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </div>
        </div>
        <div className="mt-8 w-full md:mt-0 md:w-1/2">
          <img
            src="/verse-of-the-day- image.png"
            alt="Verse of the day"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

export default VerseOfTheDay
