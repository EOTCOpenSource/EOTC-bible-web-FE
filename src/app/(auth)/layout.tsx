export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="md:bg-[#ac1d1d] bg-cover bg-no-repeat grid items-center min-h-screen">
      {children}
    </section>
  );
}
