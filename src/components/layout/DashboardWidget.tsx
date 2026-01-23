import { ArrowUp } from 'lucide-react'
import Link from 'next/link'

type Props = {
  name: string
  amount: number
  href?: string
}

const DashboardWidget = ({ name, amount, href }: Props) => {
  const content = (
    <div className="col-span-1 cursor-pointer rounded-lg border border-gray-400 px-1 pt-1 pb-2 transition-colors hover:bg-gray-50 sm:rounded-2xl">
      <div className="flex items-center justify-end">
        <div className="h-3 w-3 rotate-[45deg] sm:h-5 sm:w-5">
          <ArrowUp className="h-full w-full" />
        </div>
      </div>
      <div className="w-full flex-col items-center justify-center text-center md:py-3">
        <p className="text-xl font-bold text-[#4C0E0F] sm:text-4xl">{amount}</p>
        <p className="text-[9px] text-gray-400 sm:text-base sm:font-light">{name}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export default DashboardWidget
