import OtpForm from "@/components/forms/OtpForm"

export default function VerifyOtpPage() {
  return (

    <div className="flex min-h-screen items-center justify-center bg-[#7B1D1D] p-4">
      <div className="w-full max-w-[500px] h-[390px] rounded-[14px] bg-white p-[30px] shadow-lg flex flex-col justify-between items-center text-center" style={{ border: '6px solid #FFFFFF' }}>

    
        <OtpForm />
      </div>
    </div>
  )
}
