'use client'

import { Book, Calendar, Home, NotebookPen, PenLine, Globe } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DashboardSidebar = () => {

     const pathname = usePathname()

     const getLinkClass = (path: string) => {
          const isActive = pathname === path
          const baseStyle = "flex justify-center md:justify-start items-center gap-2 w-full rounded-md md:px-6 py-1 text-lg transition-colors"
          const activeStyle = "md:bg-red-900 md:text-white text-red-900"
          const inactiveStyle = "text-black hover:text-red-900 md:hover:bg-red-900 md:hover:text-white"

          return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
     }

     return (
          <nav className="flex md:flex-col md:h-screen md:py-4 md:gap-2 md:pb-2 sm:mx-6 m-3 py-1 border-[1.5px] md:border-0 rounded-xl">
               <Link href='/dashboard'
                    className={getLinkClass('/dashboard')}
               >
                    <Home size={20} />
                    <p className="hidden md:block">Home</p>
               </Link>
               <Link href='/dashboard/highlights'
                    className={getLinkClass('/dashboard/highlights')}
               >
                    <PenLine size={20} />
                    <p className="hidden md:block">Highlights</p>
               </Link>
               <Link href='/dashboard/notes'
                    className={getLinkClass('/dashboard/notes')}
               >
                    <NotebookPen size={20} />
                    <p className="hidden md:block">Notes</p>
               </Link>
               <Link href='/dashboard/notes/public'
                    className={getLinkClass('/dashboard/notes/public')}
               >
                    <Globe size={20} />
                    <p className="hidden md:block">Community</p>
               </Link>
               <Link
                    href='/dashboard/plans'
                    className={getLinkClass('/dashboard/plans')}
               >
                    <Calendar size={20} />
                    <p className="hidden md:block">Plans</p>
               </Link>
               <Link
                    href='/dashboard/bookmarks'
                    className={getLinkClass('/dashboard/bookmarks')}
               >
                    <Book size={20} />
                    <p className="hidden md:block">Bookmarks</p>
               </Link>
          </nav>
     )
}

export default DashboardSidebar
