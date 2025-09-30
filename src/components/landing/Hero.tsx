import React from "react";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative w-[1416px] h-[706px] text-white"
      style={{
        backgroundImage: "url(/hero-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(127, 29, 29, 0.9) 0%, rgba(127, 29, 29, 0.7) 28%, transparent 100%)",
        }}
      ></div>
      <div className="relative container mx-auto px-4">
        <div className="absolute top-[319px] left-[48px] w-[554px] h-[228px]">
          <p className="text-sm bg-black/30 rounded-md px-3 py-1 inline-block">
            Developed by EOTCOpenSource &gt;
          </p>
          <h1 className="text-5xl mt-2">
            Open Source <br />{" "}
            <span className="text-yellow-400">
              Ethiopian <br />
            </span>{" "}
            Bible Project
          </h1>
          <p className="mt-4 text-lg">
            Explore the Ethiopian Bible's heritage. Dive into <br /> scriptures
            and connect with your faith.
          </p>
          <button className="mt-8 bg-white text-red-900 pl-6 pr-2 py-2 rounded-md flex items-center space-x-2 text-lg">
            <span>Read Online</span>
            <div className="bg-red-900 text-white rounded-md p-2 flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
          </button>
        </div>
        <div className="absolute top-[480px] right-[24px] w-[480px] bg-gradient-to-t from-gray-100 to-white text-black p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="h-28 overflow-hidden ">
              <div className="w-32 h-32 bg-gray-800 rounded-2xl p-2 mr-16 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                  <img
                    src="/qr-code.png"
                    alt="QR Code"
                    className="rounded-lg w-full h-full object-contain "
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                Get the EOTCBible mobile app
              </h3>
              <p className="text-sm mt-2">
                Read the Ethiopian bible, explore plans, and seek God every day.
              </p>
              <div className="flex mt-4 space-x-2">
                <div className="w-32 h-10 bg-gray-300 rounded-md">
                  {/* Google Play Placeholder */}
                </div>
                <div className="w-32 h-10 bg-gray-300 rounded-md">
                  {/* App Store Placeholder */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
