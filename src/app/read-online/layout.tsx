'use client';

import React, { useState } from 'react';
import { AppSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import clsx from 'clsx';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider onOpenChange={() => setOpen(!open)} open={open}>
      <AppSidebar />
      <div
        className={clsx(
          "w-full min-h-screen bg-[#FFFDF8] relative",
          open && "md:pl-[300px]"
        )}
      >
        <SidebarTrigger 
          className={clsx(
            "fixed top-5 left-4 z-10",
            open && "md:left-[316px]"
          )}
          onClick={() => setOpen(!open)} 
        />
        <main className="h-full overflow-y-auto">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}