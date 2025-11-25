'use client'

import { Book, Calendar, Home, NotebookPen, PenLine } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DashboardSidebar = () => {

     const pathname = usePathname()

     const getLinkClass = (path: string) => {
          const isActive = pathname === path
          const baseStyle = "flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg transition-colors"
          const activeStyle = "bg-red-900 text-white"
          const inactiveStyle = "text-black hover:bg-red-900 hover:text-white"

          return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
     }

     return (
          <nav className="flex flex-col h-screen py-4 gap-2 pb-2 mx-6 my-2">
               <Link href='/dashboard'
                    className={getLinkClass('/dashboard')}
               >
                    <Home size={20} />
                    Home
               </Link>
               <Link href='/dashboard/highlights'
                    className={getLinkClass('/dashboard/highlights')}
               >
                    <PenLine size={20}/>
                    Highlights
               </Link>
               <Link href='/dashboard/notes'
                    className={getLinkClass('/dashboard/notes')}
               >
                    <NotebookPen size={20} />
                    Notes
               </Link>
               <Link
                    href='/dashboard/plans'
                    className={getLinkClass('/dashboard/plans')}
               >
                    <Calendar size={20} />
                    Plans
               </Link>
               <Link
                    href='/dashboard/bookmarks'
                    className={getLinkClass('/dashboard/bookmarks')}
               >
                    <Book size={20}/>
                    Bookmarks
               </Link>  
          </nav>
     )
}

export default DashboardSidebar
