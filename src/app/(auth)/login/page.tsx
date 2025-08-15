import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
