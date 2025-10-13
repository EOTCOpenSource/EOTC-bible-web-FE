'use client'

import React from 'react'
import { AppSidebar } from '@/components/layout/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { useUIStore } from '@/stores/uiStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isReadOnlineSidebarOpen, toggleReadOnlineSidebar } = useUIStore()

  return (
    <SidebarProvider onOpenChange={toggleReadOnlineSidebar} open={isReadOnlineSidebarOpen}>
      <AppSidebar />
      <div className={clsx('relative min-h-screen w-full bg-[#FFFDF8]')}>
        <SidebarTrigger
          className={clsx('fixed top-5 left-4 z-10', isReadOnlineSidebarOpen && 'md:left-[316px]')}
        />
        <main
          className={clsx(
            'h-full overflow-y-auto',
            isReadOnlineSidebarOpen && 'md:w-[calc(100%-300px)] md:pl-[300px]',
          )}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
