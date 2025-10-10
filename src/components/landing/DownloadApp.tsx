import React from 'react'

const DownloadApp = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20">
      <div
        className="absolute inset-0 -rotate-33 transform bg-cover bg-center md:rotate-0"
        style={{ backgroundImage: "url('/download-app-card-bg.png')" }}
      ></div>
      <div className="relative container mx-auto flex items-center justify-center px-4">
        <div className="flex h-auto w-full max-w-[1449px] items-center justify-center md:h-[410px]">
          <div className="relative flex h-auto w-full max-w-[859px] items-center justify-center md:h-[386px]">
            <div
              className="flex h-auto w-full max-w-[859px] flex-col items-center items-start justify-between rounded-[15px] bg-cover bg-center p-4 pb-0 md:h-[305px] md:flex-row md:justify-start md:p-0"
              style={{ backgroundImage: "url('/download-bg.png')" }}
            >
              <div className="h-auto w-full md:mt-[46px] md:ml-[32px] md:h-[158px] md:w-[455px] md:text-left">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Download the EOTCBible App Now!
                </h2>
                <p className="mt-4 text-sm text-white md:text-base">
                  Explore your spiritual journey and engage with scriptures. Discover insights that
                  resonate with your faith and connect deeply with teachings that have shaped
                  beliefs.
                </p>
                <div className="mt-8 flex justify-center space-x-4 md:justify-start">
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
              <div className="mt-8 md:absolute md:-top-12 md:right-0 md:mt-0 md:pb-0">
                <img src="/mobile-hand.png" alt="Mobile in hand" className="h-[386px] w-[292px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadApp
