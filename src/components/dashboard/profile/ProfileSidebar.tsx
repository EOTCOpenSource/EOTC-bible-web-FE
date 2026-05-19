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
  const displayTheme = mounted
    ? nextTheme === 'system'
      ? 'System'
      : resolvedTheme === 'dark'
        ? 'Dark'
        : 'Light'
    : ''

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
      onClick: () => {},
    },
    {
      id: 'notifications',
      label: t('notifications'),
      icon: Bell,
      hasSwitch: true,
      onClick: handleNotificationToggle,
    },
    {
      id: 'theme',
      label: t('profile.theme'),
      icon: mounted && resolvedTheme === 'dark' ? Moon : Sun,
      value: displayTheme,
      onClick: () => setIsThemeDropdownOpen(!isThemeDropdownOpen),
    },
    {
      id: 'language',
      label: tNav('language'),
      icon: Globe,
      value: currentLanguage,
      onClick: () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen),
    },
  ]

  return (
    <div className="flex h-auto min-h-[475px] w-full flex-col gap-6 md:w-[318px]">
      <div className="flex h-full flex-col rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm dark:border-[#3D2D2D] dark:bg-[#2A2020]">
        {/* User Info */}
        <div className="mb-8 flex items-center gap-4">
          <div className="hidden h-16 w-16 min-w-[64px] items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gray-100 md:flex dark:border-neutral-600 dark:bg-neutral-700">
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
            <h3 className="truncate text-lg font-bold text-[#1F2937] dark:text-white">
              {user?.name || 'John Doe'}
            </h3>
            <p className="truncate text-sm text-[#6B7280] dark:text-gray-400">
              {user?.email || 'johndoe@gmail.com'}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col gap-1">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <div
                onClick={item.onClick}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-xl px-4 py-3.5 transition-all',
                  item.active
                    ? 'bg-[#F9FAFB] dark:bg-[#3D2D2D]'
                    : 'hover:bg-gray-50 dark:hover:bg-[#3D2D2D]',
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className="text-[#1F2937] dark:text-gray-200"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-[#1F2937] dark:text-gray-200">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-sm font-medium text-[#6B7280] dark:text-gray-400">
                      {item.value}
                    </span>
                  )}
                  {item.hasSwitch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationToggle()
                      }}
                      disabled={notificationsLoading}
                      className={cn(
                        'relative h-5 w-9 rounded-full transition-colors focus:outline-none disabled:opacity-50',
                        dailyReadingEnabled
                          ? 'bg-black dark:bg-white'
                          : 'bg-gray-300 dark:bg-gray-600',
                      )}
                    >
                      {notificationsLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 size={12} className="animate-spin text-gray-500" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all dark:bg-black',
                            dailyReadingEnabled ? 'right-0.5' : 'left-0.5',
                          )}
                        />
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
                  <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl dark:border-[#3D2D2D] dark:bg-[#2A2020]">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#3D2D2D]"
                      >
                        <span className="font-medium text-gray-700 capitalize dark:text-white">
                          {themeOption}
                        </span>
                        {nextTheme === themeOption && (
                          <Check size={16} className="text-black dark:text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeDropdownOpen(false)}
                  />
                </>
              )}

              {/* Language Dropdown */}
              {item.id === 'language' && isLanguageDropdownOpen && (
                <>
                  <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl dark:border-[#3D2D2D] dark:bg-[#2A2020]">
                    {Object.entries(languageNames).map(([locale, name]) => {
                      // const isAvailable = locale === 'en' || locale === 'am'
                      return (
                        <button
                          key={locale}
                          onClick={() => handleLanguageChange(locale)}
                          // disabled={!isAvailable}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors',
                          )}
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {name}
                          </span>
                          {/* {!isAvailable ? (
                          <span className="text-xs text-gray-500">Coming soon</span>
                        ) : locale === currentLocale && <Check size={16} className="text-black dark:text-white" />} */}
                        </button>
                      )
                    })}
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLanguageDropdownOpen(false)}
                  />
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
            className="group flex h-[42px] w-[107px] items-center justify-between gap-[6px] rounded-[8px] border border-[#392D2D] bg-white pt-[5px] pr-[4px] pb-[5px] pl-[10px] font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-[#3D2D2D] dark:hover:bg-neutral-700"
          >
            <span className="text-[16px] leading-[100%] font-normal text-[#392D2D] dark:text-gray-200">
              {t('logOut')}
            </span>
            <div className="rounded-full bg-[#2A2A2A] p-1 transition-colors group-hover:bg-[#F9FAFB] dark:group-hover:bg-[#3D2D2D]">
              <LogOut size={14} className="ml-0.5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
