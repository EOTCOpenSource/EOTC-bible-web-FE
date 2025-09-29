import OtpForm from "@/components/forms/OtpForm"

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 shadow-lg">
        <OtpForm />
      </div>
    </div>
  )
}
