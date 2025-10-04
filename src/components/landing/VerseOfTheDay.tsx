import React from "react";
import { Heart, Sun, ArrowUpRight, Bookmark, Send } from "lucide-react";

const VerseOfTheDay = () => {
  return (
    <section className="bg-[#FFFBF5] py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 md:pr-12">
          <div className="flex items-center mb-4">
            <Sun className="text-amber-500 mr-3" size={32} />
            <h2 className="text-3xl font-bold text-amber-900">
              Verse of The Day
            </h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            But those who hope in the LORD will renew their strength. They will
            soar on wings like eagles; they will run and not grow weary, they
            will walk and not be faint.
          </p>
          <p className="mt-4 font-semibold text-amber-800">
            — Isaiah 40:31 (NIV)
          </p>
          <div className="flex items-center space-x-8 mt-8 text-gray-500">
            <div className="bg-red-100/50 rounded-sm border p-2 flex items-center space-x-2">
              <Heart size={20} />
              <span>105.3k</span>
            </div>
            <div className="bg-red-100/50 rounded-sm border p-2 flex items-center space-x-2">
              <Send size={20} />
              <span>12.8k</span>
            </div>
            <div className="bg-red-100/50 rounded-sm border p-2 flex items-center space-x-2">
              <Bookmark size={20} />
              <span>45.9k</span>
            </div>
          </div>
          <div className="mt-10 space-x-4 flex">
            <button className="bg-red-900 text-white pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2">
              <span>Continue Reading</span>
              <div className="bg-white text-red-900 rounded-sm p-1 flex items-center justify-center w-7 h-7">
                <ArrowUpRight size={20} />
              </div>
            </button>
            <button className="bg-white text-red-900 pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 border border-red-900">
              <span>VOTD Archive</span>
              <div className="bg-red-900 text-white rounded-sm p-1 flex items-center justify-center w-7 h-7">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <img
            src="/verse-of-the-day- image.png"
            alt="Verse of the day"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default VerseOfTheDay;
