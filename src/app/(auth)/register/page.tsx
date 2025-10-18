import RegisterForm from '@/components/forms/RegisterForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="md-w-full top-4 left-0 mx-auto max-h-[94vh] scroll-py-9 overflow-y-scroll no-scrollbar bg-gray-100 p-2 md:flex md:max-w-5xl md:items-center md:rounded-3xl md:p-6">
      <div className="image-box overflow-hidden rounded-2xl bg-red-500 sm:max-h-[60vh] md:aspect-[6/8] md:h-full md:max-h-[92vh] md:max-w-[50%]">
        <img
          src={'https://images.pexels.com/photos/17852030/pexels-photo-17852030.jpeg'}
          className="h-full w-full rounded-2xl object-cover"
          alt="woman-in-white-robes-and-with-candle"
        />
      </div>
      <div className="form-box md:px-2">
        <RegisterForm />
      </div>
    </div>
  )
}
