'use client'
import React from 'react'
import { Award, ChevronRight,ArrowRight, BookMarked } from 'lucide-react'
import { Calendar } from '../ui/calendar'


const RightSidebar = () => {

     const [month, setMonth] = React.useState<Date | undefined>(new Date(2025, 7, 1))

     const streakDates = [
          new Date(2025, 7, 1),
          new Date(2025, 7, 4),
          new Date(2025, 7, 12),
          new Date(2025, 7, 13),
          new Date(2025, 7, 17),
          new Date(2025, 7, 18),
          new Date(2025, 7, 19),
          new Date(2025, 7, 20),
     ]

     return (
          <div className='flex flex-col gap-8 md:gap-6 py-3 w-full '>
               <div className='border border-gray-400 rounded-xl p-6'>
                    <div className='flex gap-1 items-center text-red-900'>
                         <Award size={20}/>
                         <h4 className='text-lg font-medium'>Achievement</h4>
                    </div>
                    <div className='flex flex-col gap-2 justify-between items-center mt-4'>
                         <div className='w-full flex justify-between items-center'>                               
                              <div className='flex flex-col gap-0'>
                                   <p className='text-sm'>7-Day Streak</p>
                                   <span className='text-gray-400 text-[10px]'>
                                        Unlocked 2 days ago
                                   </span>
                              </div>
                              <ChevronRight size={16} className='cursor-pointer'/>
                         </div>
                         <hr className='bg-gray-300 h-[1.5px] w-full'/>
                    </div>
                    <div className='flex flex-col gap-2 justify-between items-center mt-4'>
                         <div className='w-full flex justify-between items-center'>                               
                              <div className='flex flex-col gap-0'>
                                   <p className='text-sm'>100 Chapters</p>
                                   <span className='text-gray-400 text-[10px]'>
                                        Unlocked 1 week ago
                                   </span>
                              </div>
                              <ChevronRight size={16} className='cursor-pointer'/>
                         </div>
                         <hr className='bg-gray-300 h-[1.5px] w-full'/>
                    </div>     
                    
                    <div className='flex justify-center items-center pt-5'>
                         <button className='flex justify-end items-center text-red-900 cursor-pointer'>
                              <p>View More</p>
                              <ArrowRight size={18}/>
                         </button>
                    </div>
               </div>

               <button className='bg-red-900 text-white text-lg py-2 rounded-lg cursor-pointer'>
                    Continue Reading
               </button>

               <div className='border border-gray-400 rounded-xl p-6'>
                    <div className='flex gap-1 items-center text-red-900'>
                         <BookMarked size={20}/>
                         <h4 className='text-lg font-medium'>Daily Verse</h4>
                    </div> 
                    <div className='text-red-900'>
                         <p className='text-sm py-3'>For God so loved the world, that he gave his only Son,
                              that whoever believes in him should not perish but have eternal life.
                         </p>
                         <h4 className='text-right font-medium'>John 3:16</h4>
                    </div>
                    <div className='px-9'>
                         <button className='w-full bg-red-900 text-white text-sm py-2 mt-3 rounded-lg cursor-pointer'>
                              Share Verse
                         </button>
                    </div>
               </div>

               <Calendar
                    mode="single"                    
                    selected={undefined}             
                    onSelect={() => {}}               
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-xl w-full md:w-auto md:max-w-md md:mx-auto lg:w-full lg:max-w-none lg:mx-0 border border-gray-200 bg-background p-3"
                    captionLayout="dropdown"
                    classNames={{
                         day: "w-full p-0 text-sm font-normal rounded-full hover:bg-background hover:text-foreground",
                    }}
                    modifiers={{
                         streak: streakDates,
                    }}
                    modifiersClassNames={{
                         streak:
                              "bg-red-900 text-white rounded-full",
                    }}
               />


          </div>  
     )
}

export default RightSidebar
