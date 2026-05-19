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
  const t = useTranslations('GlobalError')
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
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-4 h-14 w-14 text-red-500" />
      <h2 className="mb-2 text-2xl font-semibold">{t('title')}</h2>
      <p className="mb-6 max-w-md text-gray-600">{t('description')}</p>

      {/* Error message with copy button */}
      <div className="mb-6 flex max-w-lg items-center gap-3 rounded-xl bg-gray-100 p-3 px-4 text-sm text-gray-700 dark:bg-neutral-800 dark:text-gray-200">
        <span className="truncate">{error.message}</span>
        <button
          onClick={handleCopy}
          className="relative flex items-center justify-center rounded-md p-1 transition hover:bg-gray-200 dark:hover:bg-neutral-700"
          aria-label="Copy error message"
        >
          {copied ? (
            <CheckCircle2 className="animate-scaleIn h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <button
        onClick={() => reset()}
        className="rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-neutral-800"
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
