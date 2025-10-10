export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-screen items-center bg-cover bg-no-repeat md:bg-[#ac1d1d]">
      {children}
    </section>
  )
}
