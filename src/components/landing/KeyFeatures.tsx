import React from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type FeatureProps = {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
};

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  image,
  reverse,
}) => (
  <div
    className={`flex flex-col-reverse md:flex-row items-center justify-center md:justify-between w-full md:max-w-[1065px] md:h-[405px] mx-auto gap-8 md:gap-0 ${
      reverse ? "md:flex-row-reverse" : ""
    }`}
  >
    <div className="md:w-[365px] flex flex-col justify-center">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
      <button
        aria-label={`Try ${title} feature now`}
        className="w-fit mt-8 bg-white text-red-900 pl-6 pr-2 py-2 rounded-lg flex items-center space-x-2 text-lg border border-red-900 hover:bg-red-50 transition"
      >
        <span>Try it now</span>
        <div className="bg-red-900 text-white rounded-sm p-1 flex items-center justify-center w-7 h-7">
          <ArrowUpRight size={20} />
        </div>
      </button>
    </div>

    <div className="w-full md:w-[546px] md:h-[405px]">
      <Image
        src={image}
        alt={title}
        width={546}
        height={405}
        className="rounded-lg object-cover w-full h-full shadow-lg"
      />
    </div>
  </div>
);

type FeatureItem = {
  title: string;
  description: string;
  image: string;
};

const KeyFeatures: React.FC = () => {
  const features: FeatureItem[] = [
    {
      title: "Highlight, Bookmark & Share",
      description:
        "Mark verses that resonate with you. Highlight passages, add bookmarks, and easily share scripture with friends on social media or messaging apps.",
      image: "/Feature1.png",
    },
    {
      title: "Bible Reading Plans",
      description:
        "Stay consistent with guided reading plans. Choose from themes, set durations, or create your own plan to strengthen your spiritual journey.",
      image: "/Feature2.png",
    },
    {
      title: "Sync Progress Across Devices",
      description:
        "Seamlessly continue your Bible study across multiple devices. Your highlights, notes, and progress automatically stay in sync.",
      image: "/Feature1.png",
    },
    {
      title: "Offline Access",
      description:
        "Access the Bible anywhere, even without the internet. Download versions for offline reading—perfect for traveling, commuting, or remote areas.",
      image: "/Feature2.png",
    },
    {
      title: "Gentle Reminders",
      description:
        "Stay engaged with customizable notifications that encourage you to read at your preferred time every day.",
      image: "/Feature1.png",
    },
    {
      title: "Notes & Reflections",
      description:
        "Write down your insights and reflections while studying scripture. Keep them organized like a personal spiritual journal within the app.",
      image: "/Feature2.png",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-polysans font-semibold text-[36px] text-center mx-auto md:w-[500px] md:h-[82px] leading-tight">
          Key Features of the EOTCBible Application
        </h2>

        <div className="mt-16 flex flex-col gap-20">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
