import { Loader } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function Loading() {
    const t=await getTranslations('GlobalLoading')

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <Loader className="w-10 h-10 animate-spin text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm">{t('text')}</p>
      </div>
    </div>
  )
}
