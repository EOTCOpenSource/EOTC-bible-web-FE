import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Subscription from './Subscription'

const Footer = () => {
  return (
    <div>
      <Subscription />
      <footer className="m-4 rounded-xl bg-[#1a1a19] py-5 text-white">
        <div className="max-w-8xl container mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-10">
            <div className="flex max-w-sm flex-col gap-4">
              <div className="flex items-center gap-2">
                <Image src="/footer-logo.png" alt="EOTC Bible" width={32.4} height={39} />
                <span className="text-lg font-bold">EOTCBible</span>
              </div>
              <p className="text-gray-400">
                Discover the EOTCBible app for a deeper spiritual journey. Download now and explore
                the scriptures at your fingertips!
              </p>
              <div className="mt-4 flex gap-4">
                <Link href="#">
                  <Image src="/google-play-badge.svg" alt="Google Play" width={135} height={40} />
                </Link>
                <Link href="#">
                  <Image src="/app-store-badge.png" alt="App Store" width={135} height={40} />
                </Link>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Menu</h3>
                <ul className="flex gap-4">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Bible
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Plans
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Socials</h3>
                <ul className="flex gap-4">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Telegram
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Tiktok
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:gap-4">
              <h3 className="text-lg font-bold">Contact Info</h3>
              <p className="text-gray-400">+251 91 225 2354</p>
              <p className="text-gray-400">info@eotcbible.com</p>
              <p className="text-gray-400">Addis Ababa, Ethiopia</p>
              <button
                className={`mt-2 mb-8 flex items-center space-x-2 rounded-lg bg-white py-2 pr-2 pl-6 text-lg text-red-900 md:mt-8`}
              >
                <span>Contact Us</span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-sm bg-red-900 p-1 text-white`}
                >
                  <ArrowUpRight size={20} />
                </div>
              </button>
            </div>
          </div>
          <p className="text-center text-gray-400">&copy; 2025 EOTCBible. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer