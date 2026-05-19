import LoginForm from '@/components/forms/LoginForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="no-scrollbar top-4 left-0 mx-auto max-h-[94vh] w-full scroll-py-9 overflow-y-scroll bg-gray-100 p-2 md:flex md:max-w-5xl md:items-center md:rounded-3xl md:p-6 dark:bg-neutral-900">
      <div className="image-box overflow-hidden rounded-2xl bg-red-500 sm:max-h-[60vh] md:aspect-[6/8] md:h-full md:max-h-[92vh] md:max-w-[50%]">
        <Image
          src="https://images.pexels.com/photos/17852064/pexels-photo-17852064.jpeg"
          className="h-full w-full rounded-2xl object-cover"
          alt="woman-in-white-robes-and-with-candle"
          width={600}
          height={800}
          priority
          unoptimized
        />
      </div>
      <div className="form-box flex-1 md:px-4">
        <LoginForm />
      </div>
    </div>
  )
}
