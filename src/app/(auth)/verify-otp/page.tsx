import OtpForm from '@/components/forms/OtpForm'

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7B1D1D] dark:bg-neutral-900 p-4">
      <div
        className="flex h-[390px] w-full max-w-[500px] flex-col items-center justify-between rounded-[14px] bg-white dark:bg-neutral-800 p-[30px] text-center shadow-lg border-[6px] border-white dark:border-neutral-700"
      >
        <OtpForm />
      </div>
    </div>
  )
}
