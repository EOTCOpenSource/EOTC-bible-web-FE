import React from "react";

const DownloadApp = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transform -rotate-33 md:rotate-0"
        style={{ backgroundImage: "url('/download-app-card-bg.png')" }}
      ></div>
      <div className="container mx-auto px-4 flex justify-center items-center relative">
        <div className="w-full max-w-[1449px] h-auto md:h-[410px] flex justify-center items-center">
          <div className="w-full max-w-[859px] h-auto md:h-[386px] flex justify-center items-center relative">
            <div
              className="w-full max-w-[859px] h-auto md:h-[305px] rounded-[15px] bg-cover bg-center flex flex-col md:flex-row justify-between items-center md:justify-start items-start p-4 md:p-0 pb-0"
              style={{ backgroundImage: "url('/download-bg.png')" }}
            >
              <div className="w-full md:w-[455px] h-auto md:h-[158px] md:ml-[32px] md:mt-[46px] md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Download the EOTCBible App Now!
                </h2>
                <p className="mt-4 text-white text-sm md:text-base">
                  Explore your spiritual journey and engage with scriptures.
                  Discover insights that resonate with your faith and connect
                  deeply with teachings that have shaped beliefs.
                </p>
                <div className="flex mt-8 space-x-4 justify-center md:justify-start">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/google-play-badge.svg"
                      alt="Get it on Google Play"
                      className="w-32 md:w-32"
                    />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/app-store-badge.png"
                      alt="Download on the App Store"
                      className="w-32 md:w-32"
                    />
                  </a>
                </div>
              </div>
              <div className="md:absolute md:right-0 md:-top-12 mt-8 md:mt-0 md:pb-0">
                <img
                  src="/mobile-hand.png"
                  alt="Mobile in hand"
                  className="w-[292px] h-[386px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
