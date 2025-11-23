import { Book, Calendar, Home, NotebookPen, PenLine } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

type Props = {
     activeTab: string
     setActiveTab:  Dispatch<SetStateAction<"highlight" | "home" | "plans" | "notes" | "bookmarks">>
}

const DashboardSidebar = ({activeTab, setActiveTab }:Props) => {
  return (
       <nav className="flex flex-col h-screen py-4 gap-2 pb-2 ">
          <button
               onClick={() => setActiveTab('home')}
               className={`flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg ${
               activeTab === 'home'
                    ? 'bg-red-900 text-white'
                    : 'text-black hover:bg-red-900 hover:text-white'
               }`}
            >
               <Home size={20} fill="white"/>
               Home
          </button>
          <button
               onClick={() => setActiveTab('highlight')}
               className={`flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg ${
               activeTab === 'highlight'
                    ? 'bg-red-900 text-white'
                    : 'text-black hover:bg-red-900 hover:text-white'
               }`}
            >
               <PenLine size={20} fill="white"/>
               Highlight
          </button>
          <button
               onClick={() => setActiveTab('notes')}
               className={`flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg ${
               activeTab === 'notes'
                    ? 'bg-red-900 text-white'
                    : 'text-black hover:bg-red-900 hover:text-white'
               }`}
            >
               <NotebookPen size={20} fill="white"/>
               Notes
            </button>
          <button
               onClick={() => setActiveTab('plans')}
               className={`flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg ${
               activeTab === 'plans'
                    ? 'bg-red-900 text-white'
                    : 'text-black hover:bg-red-900 hover:text-white'
               }`}
            >
                 <Calendar size={20} />
               Plans
            </button>
          <button
               onClick={() => setActiveTab('bookmarks')}
               className={`flex justify-start items-center gap-2 w-full rounded-md px-6 py-1 text-lg ${
               activeTab === 'bookmarks'
                    ? 'bg-red-900 text-white'
                    : 'text-black hover:bg-red-900 hover:text-white'
               }`}
            >
               <Book size={20}/>
               Bookmarks
          </button>  
    </nav>
  )
}

export default DashboardSidebar
