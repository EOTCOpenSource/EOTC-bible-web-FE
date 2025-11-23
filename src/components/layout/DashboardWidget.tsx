import { ArrowUp } from "lucide-react"

type Props = {
     name: string
     amount: number
}

const DashboardWidget = ({name, amount}:Props) => {
     return (
          <div className="relative flex border border-gray-200 rounded-2xl">
               <div className="py-3 w-40  flex-col items-center justify-center text-center">
                    <p className="text-4xl font-bold text-red-900">{amount}</p>
                    <p className="text-base font-light text-gray-400">{name}</p>
               </div>
               <div className="absolute right-0 p-1 rotate-[45deg]">
                    <ArrowUp size={20} />
               </div>
          </div>
     )
}

export default DashboardWidget
