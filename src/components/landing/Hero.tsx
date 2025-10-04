import React from "react";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen text-white"
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
      <div className="relative container mx-auto px-4 h-full min-h-[766px] flex flex-col justify-center">
        <div className="w-full md:absolute md:top-[319px] md:left-[48px] md:w-[554px] text-left mt-48 md:mt-0">
          <p className="text-red-100 text-sm bg-red-900/30 rounded-full px-3 inline-block">
            Developed by EOTCOpenSource &gt;
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mt-2">
            Open Source{" "}
            <span className="text-yellow-400 italic">Ethiopian</span> <br />
            Bible Project
          </h1>
          <p className="mt-4 text-lg">
            Explore the Ethiopian Bible's heritage. Dive into scriptures and
            connect with your faith.
          </p>
          <button className="mt-8 bg-white text-red-900 pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 text-lg">
            <span>Read Online</span>
            <div className="bg-red-900 text-white rounded-sm p-1 flex items-center justify-center w-7 h-7">
              <ArrowUpRight size={20} />
            </div>
          </button>
        </div>

        {/* APP DOWNLOAD CARD */}
        <div className="mt-8 mb-8 md:mb-0 md:absolute md:bottom-4 md:right-6 w-full max-w-md mx-auto md:w-[480px] bg-gradient-to-t from-gray-100 to-white text-black p-6 rounded-lg shadow-lg">
          {/* MOBILE LAYOUT */}
          <div className="block md:hidden text-center">
            <div className="flex items-center justify-center">
              <img
                src="/app-icon.png"
                alt="App Icon"
                className="w-10 h-10 mr-3"
              />
              <h3 className="font-bold text-lg">
                Get the EOTCBible mobile app
              </h3>
            </div>
            <p className="text-sm mt-2">
              Read the Ethiopian bible, explore plans, and seek God every day.
            </p>
            <div className="flex mt-4 space-x-2 justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/google-play-badge.svg"
                  alt="Get it on Google Play"
                  width="128"
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/app-store-badge.png"
                  alt="Download on the App Store"
                  width="128"
                />
              </a>
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:flex items-center">
            <div className="h-[135px] overflow-hidden w-32 mr-6 flex-shrink-0">
              <div className="w-full h-56 bg-white border-4 border-gray-900 rounded-2xl p-2 flex items-start justify-center shadow-lg pt-4 relative">
                <div className="absolute top-2 w-8 h-2 bg-gray-800 rounded-full"></div>
                <div className="w-full h-auto bg-white rounded-lg flex items-center justify-center p-1 mt-6">
                  <img
                    src="/qr-code.png"
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <img
                  src="/app-icon.png"
                  alt="App Icon"
                  className="w-10 h-10 mr-3"
                />
                <h3 className="font-bold text-lg">
                  Get the EOTCBible mobile app
                </h3>
              </div>
              <p className="text-sm mt-2">
                Read the Ethiopian bible, explore plans, and seek God every day.
              </p>
              <div className="flex mt-4 space-x-2">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/google-play-badge.svg"
                    alt="Get it on Google Play"
                    width="128"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/app-store-badge.png"
                    alt="Download on the App Store"
                    width="128"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
