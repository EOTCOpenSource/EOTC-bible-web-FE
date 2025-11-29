import { ArrowUp } from "lucide-react"

type Props = {
     name: string
     amount: number
}

const DashboardWidget = ({name, amount}:Props) => {
     return (
          <div className="w-full pt-1 pb-2 px-1 border border-gray-400 rounded-lg sm:rounded-2xl">
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
}

export default DashboardWidget
