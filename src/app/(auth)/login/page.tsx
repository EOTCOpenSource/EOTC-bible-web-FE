import LoginForm from '@/components/forms/LoginForm'
import RegisterForm from '@/components/forms/RegisterForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="md-w-full top-4 left-0 mx-auto max-h-[94vh] overflow-y-scroll bg-gray-100 p-2 md:flex md:max-w-5xl md:items-center md:rounded-3xl md:p-6">
      <div className="image-box max-h-[50vh] overflow-hidden rounded-2xl bg-gray-500 sm:max-h-[60vh] md:aspect-[6/8] md:h-full md:max-h-[88vh] md:max-w-[50%]">
        <img
          src={'https://images.pexels.com/photos/17852064/pexels-photo-17852064.jpeg'}
          className="h-full w-full rounded-2xl object-cover"
          alt="woman-in-white-robes-and-with-candle"
        />
      </div>
      <div className="form-box flex-1 md:px-4">
        <LoginForm />
      </div>
    </div>
  )
}
