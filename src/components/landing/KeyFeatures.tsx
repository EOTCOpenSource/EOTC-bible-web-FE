'use client'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

type FeatureProps = {
  title: string
  description: string
  image: string
  reverse?: boolean
}

const Feature: React.FC<FeatureProps> = ({ title, description, image, reverse }) => {
  const t = useTranslations('KeyFeatures')
return (
  <div
    className={`mx-auto flex w-full flex-col-reverse items-center justify-center gap-8 md:h-[405px] md:max-w-[1065px] md:flex-row md:justify-between md:gap-0 ${
      reverse ? 'md:flex-row-reverse' : ''
    }`}
  >
    <div className="flex flex-col justify-center md:w-[365px]">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
      <button
        aria-label={`Try ${title} feature now`}
        className="mt-8 flex w-fit items-center space-x-2 rounded-lg border border-red-900 bg-white py-2 pr-2 pl-6 text-lg text-red-900 transition hover:bg-red-50"
      >
        <span>{title.includes('Try') ? title : t('tryNow')}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-red-900 p-1 text-white">
          <ArrowUpRight size={20} />
        </div>
      </button>
    </div>

    <div className="w-full md:h-[405px] md:w-[546px]">
      <Image
        src={image}
        alt={title}
        width={546}
        height={405}
        className="h-full w-full rounded-lg object-cover shadow-lg"
      />
    </div>
  </div>
)
}
const KeyFeatures: React.FC = () => {
  const t = useTranslations('KeyFeatures')

  const features = [
    {
      title: t('feature1.title'),
      description: t('feature1.description'),
      image: '/Feature1.png',
    },
    {
      title: t('feature2.title'),
      description: t('feature2.description'),
      image: '/Feature2.png',
    },
    {
      title: t('feature3.title'),
      description: t('feature3.description'),
      image: '/Feature1.png',
    },
    {
      title: t('feature4.title'),
      description: t('feature4.description'),
      image: '/Feature2.png',
    },
    {
      title: t('feature5.title'),
      description: t('feature5.description'),
      image: '/Feature1.png',
    },
    {
      title: t('feature6.title'),
      description: t('feature6.description'),
      image: '/Feature2.png',
    },
  ]

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-polysans mx-auto text-center text-[36px] leading-tight font-semibold md:h-[82px] md:w-[500px]">
          {t('sectionTitle')}
        </h2>

        <div className="mt-16 flex flex-col gap-20">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default KeyFeatures
