import React from "react";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative w-[1425px] h-[766px] text-white mx-auto"
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
      <div className="relative container mx-auto px-4 h-full">
        <div className="absolute top-[319px] left-[48px] w-[554px] h-[228px]">
          <p className="text-red-100 text-sm bg-red-900/30 rounded-full px-3 inline-block">
            Developed by EOTCOpenSource &gt;
          </p>
          <h1 className="text-6xl font-bold mt-2">
            Open Source <br />{" "}
            <span className="text-yellow-400 italic">
              Ethiopian <br />
            </span>{" "}
            Bible Project
          </h1>
          <p className="mt-4 text-lg">
            Explore the Ethiopian Bible's heritage. Dive into <br /> scriptures
            and connect with your faith.
          </p>
          <button className="mt-8 bg-white text-red-900 pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 text-lg">
            <span>Read Online</span>
            <div className="bg-red-900 text-white rounded-sm p-1 flex items-center justify-center w-7 h-7">
              <ArrowUpRight size={20} />
            </div>
          </button>
        </div>
        <div className="absolute bottom-4 right-[24px] w-[480px] bg-gradient-to-t from-gray-100 to-white text-black p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="h-[135px] overflow-hidden w-32 mr-6">
              <div className="w-full h-56 bg-white border-5 border-gray-900 rounded-2xl p-2 flex items-start justify-center shadow-lg pt-4 relative">
                <div className="absolute top-2 w-8 h-2 bg-gray-800 rounded-full"></div>
                <div className="w-full h-auto bg-white rounded-lg flex items-center justify-center p-1 mt-6">
                  <img
                    src="/qr-code.png"
                    alt="QR Code"
                    className="w-full h-full object-fill"
                  />
                </div>
              </div>
            </div>
            <div>
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
                  <img src="/google-play-badge.svg" alt="Get it on Google Play" width="128" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/app-store-badge.png" alt="Download on the App Store" width="128" />
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
