'use client'

interface CircularProgressProps {
    pct: number
    size?: number
    strokeWidth?: number
    color?: string
    trackColor?: string
    children?: React.ReactNode
}

export default function CircularProgress({
    pct,
    size = 64,
    strokeWidth = 5,
    color = '#4C0E0F',
    trackColor,
    children,
}: CircularProgressProps) {
    const r = (size - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const dash = circ * Math.min(pct, 100) / 100

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={trackColor ?? 'currentColor'}
                    strokeWidth={strokeWidth}
                    className="text-gray-200 dark:text-neutral-800"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
