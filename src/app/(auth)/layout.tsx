export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#ac1d1d] bg-cover bg-no-repeat min-h-dvh md:p-11">
      {children}
    </section>
  );
}
