import { getTranslations } from "next-intl/server"

export default async function CreateNotePage() {
  const t = await getTranslations('Notes.Create')
  
  return <p>{t('title')}</p>
}