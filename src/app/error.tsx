'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    const t= useTranslations('GlobalError')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error?.message || 'Unknown error')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      console.error('Failed to copy error message')
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="w-14 h-14 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {t('description')}
      </p>

      {/* Error message with copy button */}
      <div className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 rounded-xl p-3 px-4 text-sm flex items-center gap-3 mb-6 max-w-lg">
        <span className="truncate">{error.message}</span>
        <button
          onClick={handleCopy}
          className="relative flex items-center justify-center p-1 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          aria-label="Copy error message"
        >
          {copied ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 animate-scaleIn" />
          ) : (
            <Copy className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <button
        onClick={() => reset()}
        className="rounded-full bg-black text-white px-5 py-2 text-sm hover:bg-neutral-800 transition"
      >
        {t('tryAgain')}
      </button>

      <style jsx global>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
