import OtpForm from '@/components/forms/OtpForm'

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7B1D1D] p-4 dark:bg-neutral-900">
      <div className="flex h-[390px] w-full max-w-[500px] flex-col items-center justify-between rounded-[14px] border-[6px] border-white bg-white p-[30px] text-center shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
        <OtpForm />
      </div>
    </div>
  )
}
