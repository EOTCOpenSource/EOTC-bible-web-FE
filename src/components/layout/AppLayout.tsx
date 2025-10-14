'use client'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import clsx from 'clsx'

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { open: isSidebarOpen } = useSidebar()
  
  return (
    <>
      <AppSidebar />
      <div
        className={clsx(
          "w-full min-h-screen bg-background relative"
        )}
      >
        <SidebarTrigger 
          className={clsx(
            "fixed top-5 left-4 z-10",
            isSidebarOpen && "md:left-[316px]"
          )}
        />
        <main className={clsx("h-full overflow-y-auto", isSidebarOpen && "md:pl-[300px] md:w-[calc(100%-300px)]")}>
          {children}
        </main>
      </div>
    </>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
