import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Home } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-screen items-center bg-cover bg-no-repeat md:bg-[#ac1d1d]">
      <Link href={'/'} className="absolute top-4 left-4">
        <Button variant={'ghost'} size={'icon'} className="bg-gray-200">
          <Home />
        </Button>
      </Link>
      {children}
      <Toaster position="top-right"/>
    </section>
  )
}
