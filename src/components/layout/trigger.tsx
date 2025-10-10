'use client'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export function Trigger() {
  const { open } = useSidebar()

  return (
    <div className={`relative transition-all duration-300 ${open ? 'md:pl-30' : 'pl-0'}`}>
      <SidebarTrigger className="!visible absolute z-50 flex items-center justify-center rounded-[4px] !opacity-100 hover:bg-[#F2EFE8]" />
    </div>
  )
}
