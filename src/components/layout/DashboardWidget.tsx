import { ArrowUp } from "lucide-react"
import Link from 'next/link'

type Props = {
     name: string
     amount: number
     href?: string
}

const DashboardWidget = ({name, amount, href}:Props) => {
     const content = (
          <div className="pt-1 col-span-1 pb-2 px-1 border border-gray-400 rounded-lg sm:rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
               <div className="flex justify-end items-center">
                    <div className="h-3 w-3 rotate-[45deg] sm:h-5 sm:w-5">
                         <ArrowUp className="h-full w-full" />
                    </div>
               </div>
               <div className="md:py-3 w-full flex-col items-center justify-center text-center">
                    <p className="text-xl sm:text-4xl font-bold text-red-900">{amount}</p>
                    <p className="text-[9px] sm:text-base sm:font-light text-gray-400">{name}</p>
               </div>
          </div>
     )

     if (href) {
          return <Link href={href}>{content}</Link>
     }

     return content
}

export default DashboardWidget
