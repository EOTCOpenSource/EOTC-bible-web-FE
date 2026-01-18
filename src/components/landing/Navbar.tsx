'use client'

import { useUIStore } from '@/stores/uiStore'
import { ArrowUpRight, Menu, Moon, Search, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageSelector } from '../shared/language-selector'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useEffect } from 'react'
import { SearchInput } from '../ui/search-input'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useAuthStore } from '@/stores/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, Award, Scroll, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProgressStore } from '@/stores/progressStore'

const Navbar = () => {
  const {
    isNavMenuOpen,
    isNavSearchOpen,
    toggleNavMenu,
    toggleNavSearch,
    isReadOnlineSidebarOpen,
    closeNavMenu,
  } = useUIStore()

  const { user, isLoggedIn, loadSession } = useUserStore()
  const { logout } = useAuthStore()
  const { progress } = useProgressStore()
  const router = useRouter()

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const isReaderPage = pathname.includes('/read-online')

  const showFullNavbar = !isReaderPage || (isReaderPage && !isReadOnlineSidebarOpen)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNavMenuOpen) {
        closeNavMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNavMenuOpen, closeNavMenu])


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeNavMenu()


        if (isNavSearchOpen) toggleNavSearch()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [closeNavMenu, isNavSearchOpen, toggleNavSearch])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  // Calculate badges
  const totalChaptersRead = Object.values(progress.chaptersRead || {}).reduce((acc, chapters) => acc + chapters.length, 0)

  const badges = [
    {
      name: "Beginner",
      icon: Scroll,
      earned: totalChaptersRead >= 1,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      name: "Devoted",
      icon: Award,
      earned: totalChaptersRead >= 10,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      name: "Scholar",
      icon: Crown,
      earned: totalChaptersRead >= 50,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  return (
    <div
      className={clsx(
        'fixed top-2 left-1/2 z-30 w-full max-w-7xl -translate-x-1/2 px-4 transition-all duration-300',
        isReaderPage &&
        isReadOnlineSidebarOpen &&
        'md:left-[calc(50%+150px)] md:w-[calc(100%-300px)]',
      )}
    >
      <div className="rounded-md bg-white shadow-lg backdrop-blur-sm">
        <div className="px-4 py-2 md:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Left Section */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">{t('siteName')}</span>
              </Link>
              <div className="hidden items-center space-x-8 md:flex">
                <Link href="/read-online" className="text-black hover:text-gray-900">
                  {t('bible')}
                </Link>
                <Link href="#" className="text-black hover:text-gray-900">
                  {t('plans')}
                </Link>
                <Link href="/dashboard/notes" className="text-black hover:text-gray-900">
                  {t('notes')}
                </Link>
              </div>
            </div>

            {/* Center/Right - Full Desktop */}
            {showFullNavbar && (
              <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
                <div className="relative w-64">
                  <SearchInput
                    placeholder={t('search')}
                    showResults={true}
                    containerClassName="w-full"
                  />
                </div>

                <button className="flex h-[42px] w-fit items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white md:w-fit">
                  <span>{t('getApp')}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
                    <ArrowUpRight size={20} />
                  </div>
                </button>

                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <button className="h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <button className="h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                      {t('login')}
                    </button>
                  </Link>
                )}

                <div className="flex h-[42px] flex-shrink-0 items-center gap-1 rounded-md border p-1">
                  <button className="rounded-full p-2 hover:bg-gray-200">
                    <Moon size={18} />
                  </button>
                  <LanguageSelector />
                  {isLoggedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-full p-2 hover:bg-gray-200 outline-none">
                          <User size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[280px] p-2">
                        <div className="flex flex-col space-y-1 p-2">
                          <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />

                        <div className="p-2">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Badges</p>
                          <div className="flex justify-between items-center px-2">
                            {badges.map((badge) => (
                              <div key={badge.name} className="flex flex-col items-center gap-1 group relative">
                                <div className={clsx(
                                  "p-2 rounded-full transition-all duration-200",
                                  badge.earned ? badge.bgColor : "bg-gray-100 grayscale opacity-50"
                                )}>
                                  <badge.icon size={20} className={clsx(badge.earned ? badge.color : "text-gray-400")} />
                                </div>
                                <span className={clsx(
                                  "text-[10px] font-medium",
                                  badge.earned ? "text-gray-700" : "text-gray-400"
                                )}>{badge.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile & Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login">
                      <button className="rounded-full p-2 hover:bg-gray-200">
                        <User size={18} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Center/Right - Tablet with Sidebar */}
            {!showFullNavbar && (
              <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
                <div className="relative w-48">
                  <SearchInput
                    placeholder={t('search')}
                    containerClassName="w-full"
                    variant="compact"
                    showResults={true}
                  />
                </div>

                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <button className="h-[42px] flex-shrink-0 rounded-lg border border-red-900 bg-white px-4 py-2 text-sm text-red-900 hover:bg-red-900 hover:text-white">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <button className="h-[42px] flex-shrink-0 rounded-lg border border-red-900 bg-white px-4 py-2 text-sm text-red-900 hover:bg-red-900 hover:text-white">
                      {t('login')}
                    </button>
                  </Link>
                )}

                <div className="relative flex-shrink-0">
                  <button onClick={toggleNavMenu}>
                    <Menu size={24} />
                  </button>
                  {isNavMenuOpen && (
                    <div className="absolute top-full right-0 z-50 mt-2 rounded-md bg-white p-4 shadow-lg">
                      <div className="flex flex-col gap-3">
                        <button className="flex h-[42px] items-center gap-2 rounded-lg bg-red-900 px-6 py-2 text-sm text-white">
                          <span>{t('getApp')}</span>
                          <ArrowUpRight size={16} />
                        </button>
                        <div className="flex h-[42px] items-center gap-2 rounded-md border p-1">
                          <button className="rounded-full p-2 hover:bg-gray-200">
                            <Moon size={18} />
                          </button>
                          <LanguageSelector />
                          <button className="rounded-full p-2 hover:bg-gray-200">
                            <User size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleNavSearch} className="rounded-lg bg-red-900 p-2 text-white">
                <Search size={20} />
              </button>
              <button onClick={toggleNavMenu}>
                {isNavMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isNavMenuOpen && (
        <div className="absolute top-full left-0 mt-2 w-full rounded-md bg-white shadow-lg md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            <Link href="/read-online" className="py-2 text-black hover:text-gray-900">
              {t('bible')}
            </Link>
            <Link href="#" className="py-2 text-black hover:text-gray-900">
              {t('plans')}
            </Link>
            <Link href="/dashboard/notes" className="py-2 text-black hover:text-gray-900">
              {t('notes')}
            </Link>
            <div className="my-2 border-t"></div>
            {isLoggedIn ? (
              <Link href="/dashboard">
                <button className="h-[42px] w-full rounded-lg border border-red-900 bg-white px-6 py-2 text-left text-red-900 hover:bg-red-900 hover:text-white">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="h-[42px] w-full rounded-lg border border-red-900 bg-white px-6 py-2 text-left text-red-900 hover:bg-red-900 hover:text-white">
                  {t('login')}
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {isNavSearchOpen && (
        <div className="absolute top-full left-4 mt-2 rounded-md bg-white p-2 shadow-lg md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchInput
                placeholder={t('search')}
                containerClassName="w-full"
                autoFocus
                showResults={true}
              />
            </div>
            <button
              onClick={toggleNavSearch}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
