import React from 'react';
import TextHeader from '@/components/atoms/headings';
import Image from 'next/image';

export interface HeroBannerData {
  _id: string;
  page: string;
  title: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bannerImage: string;
  image?: string;
  height?: string | number;
  width?: string | number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface HeroBannerProps {
  herodata: HeroBannerData | null | undefined;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ herodata }) => {
  if (!herodata) return null;

  return (
    <div className="relative w-full" style={{ height: herodata.height ? (typeof herodata.height === 'number' ? `${herodata.height}px` : herodata.height) : '400px', width: herodata.width ? (typeof herodata.width === 'number' ? `${herodata.width}px` : herodata.width) : '100%' }}>
      {/* Background Image */}
      <Image
        src={herodata.bannerImage}
        alt="Hero Background"
        fill
        priority
        className="absolute inset-0 object-cover object-center w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Optional Foreground Image */}
      {herodata.image && (
        <div className="absolute bottom-4 right-4" style={{ width: herodata.width ? (typeof herodata.width === 'number' ? `${herodata.width}px` : herodata.width) : '96px', height: herodata.height ? (typeof herodata.height === 'number' ? `${herodata.height}px` : herodata.height) : '96px' }}>
          <Image
            src={herodata.image}
            alt={herodata.title}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-white text-center">
        <div className="w-full max-w-[90%] sm:max-w-[600px]">
          <TextHeader
            text={herodata.title}
            textcolor="white"
            width={600}
            specialWordsIndices="4"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
