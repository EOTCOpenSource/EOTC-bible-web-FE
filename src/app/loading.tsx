import { CircularLoader } from '@/components/loaders/circular-loader'
import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('GlobalLoading')

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <CircularLoader />
        <p className="text-sm text-gray-500">{t('text')}</p>
      </div>
    </div>
  )
}
