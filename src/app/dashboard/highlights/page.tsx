import { getTranslations } from "next-intl/server"

export default async function HighlightsPage() {
  const t = await getTranslations('Highlights')
  
  return <p>{t('title')}</p>
}