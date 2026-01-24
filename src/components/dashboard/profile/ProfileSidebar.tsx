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

export function ProfileSidebar() {
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
      onClick: () => {}
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
    <div className="flex flex-col gap-8 w-full md:w-[350px]">
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
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
          <div>
            <h3 className="font-bold text-lg text-[#1F2937]">{user?.name || 'John Doe'}</h3>
            <p className="text-sm text-[#6B7280]">{user?.email || 'johndoe@gmail.com'}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <div
                onClick={item.onClick}
                className={cn(
                  "flex items-center justify-between p-4 rounded-[16px] cursor-pointer transition-all",
                  item.active ? "bg-[#F9FAFB] border border-[#E5E7EB]" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(item.active ? "text-[#1F2937]" : "text-[#6B7280]")} />
                  <span className={cn("font-medium", item.active ? "text-[#1F2937]" : "text-[#6B7280]")}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-[#9CA3AF]">{item.value}</span>}
                  {item.hasSwitch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setNotificationsEnabled(!notificationsEnabled)
                      }}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        notificationsEnabled ? "bg-[#5C1616]" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 bg-white rounded-full absolute top-1 transition-all",
                        notificationsEnabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  )}
                  {!item.hasSwitch && <ChevronRight size={18} className="text-[#9CA3AF]" />}
                </div>
              </div>

              {/* Theme Dropdown */}
              {item.id === 'theme' && isThemeDropdownOpen && (
                <>
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-md border border-gray-200 shadow-lg">
                    <div className="py-1">
                      {(['light', 'dark', 'system'] as const).map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => handleThemeChange(themeOption)}
                          className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <span className="capitalize">{themeOption}</span>
                          {currentTheme === themeOption && <Check size={16} className="text-[#5C1616]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                </>
              )}

              {/* Language Dropdown */}
              {item.id === 'language' && isLanguageDropdownOpen && (
                <>
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-md border border-gray-200 shadow-lg">
                    <div className="py-1">
                      {Object.entries(languageNames).map(([locale, name]) => (
                        <button
                          key={locale}
                          onClick={() => handleLanguageChange(locale)}
                          className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <span>{name}</span>
                          {locale === currentLocale && <Check size={16} className="text-[#5C1616]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="inline-block">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
