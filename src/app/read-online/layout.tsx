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
          <div className={clsx('relative flex-1 overflow-y-auto bg-[#FFFDF8]')}>
            <SidebarTrigger
              className={clsx(
                'fixed top-24 left-4 z-20',
                isReadOnlineSidebarOpen && 'md:left-[316px]',
              )}
            />
            <main
              className={clsx(
                'h-full',
                isReadOnlineSidebarOpen && 'md:w-[calc(100%-300px)] md:pl-[300px]',
              )}
            >
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
