"use client";
import React from "react";
import { MoveRight, MoveLeft, ArrowUpRight } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

const aboutContent = {
  section: {
    id: "about",
    backgroundColor: "bg-red-900",
  },
  hero: {
    title: {
      line1: "Ancient Witness of",
      line2: "Faith,",
      line3: "Holding",
      highlight: "Unique Scriptures.",
    },
    image: {
      src: "/unique-scriptures.png",
      alt: "Unique Scriptures",
    },
    description:
      "The Ethiopian Orthodox Tewahedo Church (EOTC) preserves one of the most ancient and complete biblical canons globally. Written in Ge'ez, Ethiopia's classical language, it reflects a living tradition that has been faithfully maintained for centuries.",
    cta: {
      text: "Contact Us",
      bgColor: "bg-white",
      textColor: "text-red-900",
      iconBgColor: "bg-red-900",
      iconColor: "text-white",
    },
  },
  cards: [
    {
      id: 1,
      title: "81 Canonical Books",
      description:
        "The EOTC Bible has the largest biblical canon in Christianity, containing 81 books compared to the 66 found in most Western Bibles.",
    },
    {
      id: 2,
      title: "Unique Scriptures",
      description:
        "Includes texts not found elsewhere, such as the Book of Enoch, Jubilees, Sirach (Ecclesiasticus), and more.",
    },
    {
      id: 3,
      title: "Shared Heritage",
      description:
        "Respected by the Ethiopian and Eritrean Orthodox Churches, as it continues to guide worship and tradition.",
    },
  ],
  navigation: {
    buttonColor: "bg-yellow-400",
    buttonTextColor: "text-red-900",
  },
};

const About = () => {
  const { setAboutScrollRef, scrollAboutLeft, scrollAboutRight } = useUIStore();

  const allCards = [...aboutContent.cards, ...aboutContent.cards];

  return (
    <section
      id={aboutContent.section.id}
      className={`flex flex-col items-center justify-center gap-10 w-full py-20 ${aboutContent.section.backgroundColor}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="w-full md:w-1/3 h-auto md:h-[430px] flex flex-col-reverse md:flex-col">
            <h2 className="text-3xl font-bold text-white text-left mb-2 md:mb-4">
              {aboutContent.hero.title.line1}
              <br className="md:hidden" /> {aboutContent.hero.title.line2}
              <br className="hidden md:block" /> {aboutContent.hero.title.line3}{" "}
              <span className="text-yellow-400 italic">
                {aboutContent.hero.title.highlight}
              </span>
            </h2>
            <img
              src={aboutContent.hero.image.src}
              alt={aboutContent.hero.image.alt}
              className="w-full h-auto sm:h-96 object-cover rounded-lg shadow-lg mb-8 md:mb-0"
            />
          </div>

          <div className="w-full md:w-2/3 md:pl-12 mt-0 md:mt-0">
            <p className="text-gray-200 md:w-2/3">
              {aboutContent.hero.description}
            </p>

            <button
              className={`mt-8 ${aboutContent.hero.cta.bgColor} ${aboutContent.hero.cta.textColor} pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 text-lg`}
            >
              <span>{aboutContent.hero.cta.text}</span>
              <div
                className={`${aboutContent.hero.cta.iconBgColor} ${aboutContent.hero.cta.iconColor} rounded-sm p-1 flex items-center justify-center w-7 h-7`}
              >
                <ArrowUpRight size={20} />
              </div>
            </button>

            <div className="relative mt-8">
              <div
                className="mt-8 flex flex-nowrap overflow-x-hidden gap-4 pb-4 scrollbar-hide snap-x snap-mandatory scroll-px-4"
                ref={setAboutScrollRef}
              >
                {allCards.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-full sm:w-[303px] h-[188px] text-left snap-center md:mt-26"
                  >
                    <h3 className="font-bold text-amber-900">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-start mt-4 md:mt-24 space-x-0.5 md:absolute md:-top-16 md:right-0">
                <button
                  onClick={scrollAboutLeft}
                  className={`p-2 rounded-xs ${aboutContent.navigation.buttonColor} ${aboutContent.navigation.buttonTextColor} shadow-md`}
                >
                  <MoveLeft size={24} />
                </button>
                <button
                  onClick={scrollAboutRight}
                  className={`p-2 rounded-xs ${aboutContent.navigation.buttonColor} ${aboutContent.navigation.buttonTextColor} shadow-md`}
                >
                  <MoveRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
