import { getTranslations } from "next-intl/server"

export default async function NotesPage() {
  const t = await getTranslations('Notes')
  
  return <p>{t('title')}</p>
}