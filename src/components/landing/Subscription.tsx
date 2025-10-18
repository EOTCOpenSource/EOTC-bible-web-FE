import { Input } from '../ui/input'
import { ArrowUpRight } from 'lucide-react'

const Subscription = () => {
  return (
    <div className="flex justify-center bg-white pt-10 md:py-20">
      <div className="flex h-auto w-full flex-col justify-center gap-8 rounded-lg bg-[#FFFBF5] px-6 py-8 md:h-[123px] md:w-[1344px] md:flex-row md:justify-center md:gap-20 md:px-12 md:py-0">
        <h3 className="text-left text-2xl font-bold md:text-left">
          Subscribe to our newsletter for <br className="hidden md:block" /> updates and news about{' '}
          <br className="hidden md:block" /> EOTCBible!
        </h3>
        <div>
          <p className="pb-2 text-left md:text-left">Enter your email to subscribe</p>

          <form className="flex items-center gap-2 md:flex-row">
            <Input
              type="email"
              placeholder="example@email.com"
              className="h-10 w-full rounded-md border-gray-300 bg-gray-100 sm:w-80"
            />
            <button className="flex items-center justify-center space-x-2 rounded-md bg-red-900 py-2 pr-2 pl-6 text-white sm:w-auto">
              <span>Subscribe</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-1 text-red-900">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Subscription