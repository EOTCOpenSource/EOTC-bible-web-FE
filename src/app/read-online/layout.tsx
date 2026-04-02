'use client'

import React from 'react'
import { AppSidebar } from '@/components/layout/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { useUIStore } from '@/stores/uiStore'
import Navbar from '@/components/landing/Navbar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isReadOnlineSidebarOpen, toggleReadOnlineSidebar } = useUIStore()

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <SidebarProvider onOpenChange={toggleReadOnlineSidebar} open={isReadOnlineSidebarOpen}>
          <AppSidebar />
          <div className={clsx('relative flex-1 overflow-y-auto bg-[#FFFDF8] dark:bg-[#1A1A1C]')}>
            <SidebarTrigger
              className={clsx(
                'fixed top-24 z-20 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-neutral-700 dark:bg-[#1A1A1C] dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800',
                isReadOnlineSidebarOpen ? 'left-[316px]' : 'left-4 md:left-6',
              )}
            />
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
