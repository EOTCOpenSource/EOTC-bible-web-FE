"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function Trigger() {
     const { open } = useSidebar();
          
     return (
          <div className={`transition-all duration-300 relative ${open ? "md:pl-30" : "pl-0"}`}>
               <SidebarTrigger className="absolute flex justify-center items-center hover:bg-[#F2EFE8] rounded-[4px] !opacity-100 !visible z-50"/>
          </div>
     );
}
