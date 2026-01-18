import { ArrowUpRight } from 'lucide-react'

interface StatsCardProps {
    label: string
    count: number | string
    color?: string // text color for the count if needed, defaults to brand red/brown in design
}

export default function StatsCard({ label, count, color = "text-red-900" }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm relative aspect-square sm:aspect-auto sm:h-32 w-full">
            <div className="absolute top-3 right-3">
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className={`text-4xl font-bold ${color} mb-1`}>
                {count}
            </div>
            <div className="text-sm text-gray-400 font-light">
                {label}
            </div>
        </div>
    )
}
