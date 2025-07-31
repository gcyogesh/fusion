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

  // Helper function to validate and convert dimensions
  const getFixedDimension = (value: string | number | undefined, defaultValue: string) => {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string' && /^[\d.]+px$/.test(value)) return value;
    return defaultValue;
  };

  const containerHeight = getFixedDimension(herodata.height, '400px');
  // Always use full screen width regardless of settings
  const containerWidth = '100vw'; // Force full viewport width

  return (
    <div 
      className="relative mx-auto w-full" 
      style={{ 
        height: containerHeight, 
        width: containerWidth,
        maxWidth: '100vw' // Ensure full screen coverage
      }}
    >
      {/* Background Image */}
      <Image
        src={herodata.bannerImage}
        alt="Hero Background"
        fill
        priority
        className="absolute inset-0 object-cover object-center"
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Optional Foreground Image */}
      {herodata.image && (
        <div 
          className="absolute bottom-4 right-4" 
          style={{ 
            width: getFixedDimension(herodata.width, '96px'), 
            height: getFixedDimension(herodata.height, '96px') 
          }}
        >
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