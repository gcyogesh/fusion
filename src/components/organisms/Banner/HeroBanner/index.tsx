import React from 'react';
import TextHeader from '@/components/atoms/headings';
import Image from 'next/image';

const HeroBanner = ({ herodata }) => {
  if (!herodata) return null;

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
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
        <div className="absolute bottom-4 right-4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
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
