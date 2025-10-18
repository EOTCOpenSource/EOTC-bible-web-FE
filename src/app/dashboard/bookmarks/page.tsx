import { getTranslations } from "next-intl/server"


export default async function BookmarksPage() {
  const t =await getTranslations('Bookmarks')
  
  return <p>{t('title')}</p>
}