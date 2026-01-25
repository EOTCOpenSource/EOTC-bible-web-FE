import type { HighlightColor } from '@/stores/types'

export const hexToHighlightColor = (hex: string): HighlightColor => {
  const colorMap: Record<string, HighlightColor> = {
    '#FFE062': 'yellow', // Yellow
    '#3BAD49': 'green', // Green
    '#FF4B26': 'pink', // Pink/Red
    '#5778C5': 'blue', // Blue
    '#621B1C': 'red', // Dark red
    '#704A6A': 'purple', // Purple
  }

  const normalizedHex = hex.toUpperCase()
  return colorMap[normalizedHex] || 'yellow' // Default to yellow if no match
}

//Maps HighlightColor type to hex color codes
// Returns the primary hex color for each color type

export const highlightColorToHex = (color: HighlightColor): string => {
  const hexMap: Record<HighlightColor, string> = {
    yellow: '#FFE062',
    green: '#3BAD49',
    pink: '#FF4B26',
    blue: '#5778C5',
    red: '#621B1C',
    purple: '#704A6A',
  }
  return hexMap[color] || '#FFE062' // Default to yellow
}

//Maps hex color to the original hex (for direct display)
// This preserves the exact color selected by the user

export const hexToOriginalHex = (hex: string): string => {
  // Return the hex as-is for direct color display
  return hex
}

// Gets CSS background color for highlight

export const getHighlightBackgroundColor = (color: HighlightColor): string => {
  const colorMap: Record<HighlightColor, string> = {
    yellow: 'bg-yellow-200 dark:bg-yellow-900/30',
    green: 'bg-green-200 dark:bg-green-900/30',
    pink: 'bg-pink-200 dark:bg-pink-900/30',
    blue: 'bg-blue-200 dark:bg-blue-900/30',
    red: 'bg-red-200 dark:bg-[#4C0E0F]/30',
    purple: 'bg-purple-200 dark:bg-purple-900/30',
  }
  return colorMap[color] || colorMap.yellow
}

// Gets inline style background color for highlight
export const getHighlightInlineColor = (color: HighlightColor): string => {
  return highlightColorToHex(color)
}
