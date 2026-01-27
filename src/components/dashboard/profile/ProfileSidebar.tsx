'use client'

import { useState } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import { User, Bell, Sun, Moon, Globe, ChevronRight, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/LogoutButton'
import { useSettingsStore } from '@/stores/settingsStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'

const languageNames: Record<string, string> = {
  en: 'English',
  am: 'አማርኛ',
  gez: 'ግዕዝ',
  tg: 'ትግርኛ',
  or: 'Afaan Oromoo',
}

export const ProfileSidebar = () => {
  const { user } = useUserStore()
  const { theme, updateSettings } = useSettingsStore()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const router = useRouter()
  const currentLocale = useLocale()

  const currentTheme = theme || 'light'
  const currentLanguage = languageNames[currentLocale] || 'English'

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await updateSettings({ theme: newTheme })
      setIsThemeDropdownOpen(false)
      // Apply theme immediately
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark')
      }
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
      label: 'My Profile',
      icon: User,
      active: true,
      onClick: () => { }
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      hasSwitch: true,
      onClick: () => setNotificationsEnabled(!notificationsEnabled)
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: currentTheme === 'dark' ? Moon : Sun,
      value: currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1),
      onClick: () => setIsThemeDropdownOpen(!isThemeDropdownOpen)
    },
    {
      id: 'language',
      label: 'Language',
      icon: Globe,
      value: currentLanguage,
      onClick: () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full md:w-[318px] min-h-[475px] h-auto">
      <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col h-full">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 min-w-[64px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
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
            <h3 className="font-bold text-lg text-[#1F2937] truncate">{user?.name || 'John Doe'}</h3>
            <p className="text-sm text-[#6B7280] truncate">{user?.email || 'johndoe@gmail.com'}</p>
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
                  item.active ? "bg-[#F9FAFB]" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className="text-[#1F2937]" strokeWidth={1.5} />
                  <span className="font-medium text-[#1F2937]">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-[#6B7280] font-medium">{item.value}</span>}
                  {item.hasSwitch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setNotificationsEnabled(!notificationsEnabled)
                      }}
                      className={cn(
                        "w-9 h-5 rounded-full relative transition-colors focus:outline-none",
                        notificationsEnabled ? "bg-black" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                        notificationsEnabled ? "right-0.5" : "left-0.5"
                      )} />
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
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden p-1">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="capitalize text-gray-700 font-medium">{themeOption}</span>
                        {currentTheme === themeOption && <Check size={16} className="text-black" />}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                </>
              )}

              {/* Language Dropdown */}
              {item.id === 'language' && isLanguageDropdownOpen && (
                <>
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden p-1">
                    {Object.entries(languageNames).map(([locale, name]) => (
                      <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700 font-medium">{name}</span>
                        {locale === currentLocale && <Check size={16} className="text-black" />}
                      </button>
                    ))}
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
            className="w-[107px] h-[42px] border border-[#392D2D] bg-white hover:bg-gray-50 text-gray-700 pt-[5px] pb-[5px] pl-[10px] pr-[4px] rounded-[8px] font-medium flex items-center justify-between gap-[6px] transition-all group"
          >
            <span className="text-[16px] leading-[100%] font-normal text-[#392D2D]">Log Out</span>
            <div className="bg-[#2A2A2A] rounded-full p-1 group-hover:bg-black transition-colors">
              <LogOut size={14} className="text-white ml-0.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
