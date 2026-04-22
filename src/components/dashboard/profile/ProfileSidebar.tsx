'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import { User, Bell, Sun, Moon, Globe, ChevronRight, LogOut, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

const languageNames: Record<string, string> = {
  en: 'English',
  am: 'አማርኛ',
  gez: 'ግዕዝ',
  tg: 'ትግርኛ',
  or: 'Afaan Oromoo',
}

export const ProfileSidebar = () => {
  const { user } = useUserStore()
  const t = useTranslations('Dashboard')
  const tNav = useTranslations('Navigation')
  const { theme: settingsTheme, updateSettings } = useSettingsStore()
  const { theme: nextTheme, resolvedTheme, setTheme: setNextTheme } = useTheme()
  const {
    dailyReadingEnabled,
    isLoading: notificationsLoading,
    loadNotificationStatus,
    toggleDailyReading,
  } = useNotificationStore()
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const router = useRouter()
  const currentLocale = useLocale()
  
  const [mounted, setMounted] = useState(false)

  // Fetch notification status on mount
  useEffect(() => {
    setMounted(true)
    loadNotificationStatus().catch(() => {})
  }, [loadNotificationStatus])

  const currentLanguage = languageNames[currentLocale] || 'English'
  const displayTheme = mounted ? (nextTheme === 'system' ? 'System' : (resolvedTheme === 'dark' ? 'Dark' : 'Light')) : ''

  const handleNotificationToggle = async () => {
    if (notificationsLoading) return
    try {
      await toggleDailyReading()
      toast.success(
        !dailyReadingEnabled
          ? 'Daily reading notifications enabled'
          : 'Daily reading notifications disabled',
      )
    } catch {
      toast.error('Failed to update notification preference')
    }
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await updateSettings({ theme: newTheme })
      setIsThemeDropdownOpen(false)
      setNextTheme(newTheme)
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsLanguageDropdownOpen(false)
      return
    }

    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      setTimeout(() => {
        router.refresh()
      }, 100)
      setIsLanguageDropdownOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const menuItems = [
    {
      id: 'profile',
      label: t('myProfile'),
      icon: User,
      active: true,
      onClick: () => { }
    },
    {
      id: 'notifications',
      label: t('notifications'),
      icon: Bell,
      hasSwitch: true,
      onClick: handleNotificationToggle
    },
    {
      id: 'theme',
      label: t('profile.theme'),
      icon: mounted && resolvedTheme === 'dark' ? Moon : Sun,
      value: displayTheme,
      onClick: () => setIsThemeDropdownOpen(!isThemeDropdownOpen)
    },
    {
      id: 'language',
      label: tNav('language'),
      icon: Globe,
      value: currentLanguage,
      onClick: () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full md:w-[318px] min-h-[475px] h-auto">
      <div className="bg-white dark:bg-[#2A2020] rounded-[20px] p-6 border border-gray-100 dark:border-[#3D2D2D] shadow-sm flex flex-col h-full">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 min-w-[64px] rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-neutral-600">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user?.name || 'Profile avatar'}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-lg text-[#1F2937] dark:text-white truncate">{user?.name || 'John Doe'}</h3>
            <p className="text-sm text-[#6B7280] dark:text-gray-400 truncate">{user?.email || 'johndoe@gmail.com'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 flex-1">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <div
                onClick={item.onClick}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all",
                  item.active ? "bg-[#F9FAFB] dark:bg-[#3D2D2D]" : "hover:bg-gray-50 dark:hover:bg-[#3D2D2D]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className="text-[#1F2937] dark:text-gray-200" strokeWidth={1.5} />
                  <span className="font-medium text-[#1F2937] dark:text-gray-200">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-[#6B7280] dark:text-gray-400 font-medium">{item.value}</span>}
                  {item.hasSwitch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationToggle()
                      }}
                      disabled={notificationsLoading}
                      className={cn(
                        "w-9 h-5 rounded-full relative transition-colors focus:outline-none disabled:opacity-50",
                        dailyReadingEnabled ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      {notificationsLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 size={12} className="animate-spin text-gray-500" />
                        </div>
                      ) : (
                        <div className={cn(
                          "w-3.5 h-3.5 bg-white dark:bg-black rounded-full absolute top-0.5 transition-all shadow-sm",
                          dailyReadingEnabled ? "right-0.5" : "left-0.5"
                        )} />
                      )}
                    </button>
                  )}
                  {!item.hasSwitch && item.id !== 'notifications' && (
                    <ChevronRight size={16} className="text-[#9CA3AF]" />
                  )}

                </div>
              </div>

              {/* Theme Dropdown */}
              {item.id === 'theme' && isThemeDropdownOpen && (
                <>
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#2A2020] rounded-xl border border-gray-100 dark:border-[#3D2D2D] shadow-xl overflow-hidden p-1">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#3D2D2D] transition-colors"
                      >
                        <span className="capitalize text-gray-700 dark:text-white font-medium">{themeOption}</span>
                        {nextTheme === themeOption && <Check size={16} className="text-black dark:text-white" />}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                </>
              )}

              {/* Language Dropdown */}
              {item.id === 'language' && isLanguageDropdownOpen && (
                <>
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#2A2020] rounded-xl border border-gray-100 dark:border-[#3D2D2D] shadow-xl overflow-hidden p-1">
                    {Object.entries(languageNames).map(([locale, name]) => {
                      // const isAvailable = locale === 'en' || locale === 'am'
                      return (
                      <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        // disabled={!isAvailable}
                        className={cn("flex w-full items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors")}
                      >
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{name}</span>
                        {/* {!isAvailable ? (
                          <span className="text-xs text-gray-500">Coming soon</span>
                        ) : locale === currentLocale && <Check size={16} className="text-black dark:text-white" />} */}
                      </button>
                    )})}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-8 pt-4">
          <button
            onClick={async () => {
              const { logout } = (await import('@/stores/authStore')).useAuthStore.getState()
              await logout()
              router.push('/login')
            }}
            className="w-[107px] h-[42px] border border-[#392D2D] dark:border-gray-600 bg-white dark:bg-[#3D2D2D] hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 pt-[5px] pb-[5px] pl-[10px] pr-[4px] rounded-[8px] font-medium flex items-center justify-between gap-[6px] transition-all group"
          >
            <span className="text-[16px] leading-[100%] font-normal text-[#392D2D] dark:text-gray-200">{t('logOut')}</span>
            <div className="bg-[#2A2A2A] rounded-full p-1 group-hover:bg-black transition-colors">
              <LogOut size={14} className="text-white ml-0.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
