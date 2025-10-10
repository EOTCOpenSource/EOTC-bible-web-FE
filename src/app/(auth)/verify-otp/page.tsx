import OtpForm from '@/components/forms/OtpForm'

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7B1D1D] p-4">
      <div
        className="flex h-[390px] w-full max-w-[500px] flex-col items-center justify-between rounded-[14px] bg-white p-[30px] text-center shadow-lg"
        style={{ border: '6px solid #FFFFFF' }}
      >
        <OtpForm />
      </div>
    </div>
  )
}
