import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from 'lucide-react';


const Footer = () => {
  return (
        <footer className="bg-[#1a1a19] text-white py-5 m-4 rounded-xl">
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2">
              <Image src="/footer-logo.png" alt="EOTC Bible" width={32.4} height={39} />
              <span className="font-bold text-lg">EOTCBible</span>
            </div>
            <p className="text-gray-400">
              Discover the EOTCBible app for a deeper spiritual journey. Download now and explore the scriptures at your fingertips!
            </p>
            <div className="flex gap-4 mt-4">
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
            <h3 className="font-bold text-lg">Menu</h3>
            <ul className="flex gap-4">
              <li><Link href="#" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Bible</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Plans</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Socials</h3>
            <ul className="flex gap-4">
              <li><Link href="#" className="text-gray-400 hover:text-white">Telegram</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Instagram</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Tiktok</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Facebook</Link></li>
            </ul>
          </div>
</div>

          <div className="flex flex-col md:gap-4">
            <h3 className="font-bold text-lg">Contact Info</h3>
            <p className="text-gray-400">+251 91 225 2354</p>
            <p className="text-gray-400">info@eotcbible.com</p>
            <p className="text-gray-400">Addis Ababa, Ethiopia</p>
            <button
              className={`md:mt-8 mt-2 mb-8 bg-white text-red-900 pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 text-lg`}
            >
              <span>Contact Us</span>
              <div
                className={`bg-red-900 text-white rounded-sm p-1 flex items-center justify-center w-7 h-7`}
              >
                <ArrowUpRight size={20} />
              </div>
            </button>
          </div>
        </div>
          <p className="text-gray-400 text-center">&copy; 2025 EOTCBible. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;