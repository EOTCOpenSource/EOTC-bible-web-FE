'use client'

import React, { useState } from 'react'
import { AppSidebar } from '@/components/layout/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import clsx from 'clsx'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider onOpenChange={() => setOpen(!open)} open={open}>
      <AppSidebar />
      <main className={clsx('min-h-screen w-full bg-[#FFFDF8]', open && 'md:pl-[3.5rem]')}>
        <SidebarTrigger className="ml-0" onClick={() => setOpen(!open)} />
        {children}
      </main>
    </SidebarProvider>
  )
}
