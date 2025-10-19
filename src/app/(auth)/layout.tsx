import BackButton from "@/components/ui/BackButton";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-screen items-center bg-cover bg-no-repeat md:bg-[#ac1d1d]">
      <BackButton />
      {children}
      <Toaster position="top-right"/>
    </section>
  )
}
