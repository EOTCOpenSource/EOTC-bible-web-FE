import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
