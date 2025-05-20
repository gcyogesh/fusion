
import React from 'react';
import Image from 'next/image';
import TextHeader from '@/components/atoms/headings';
import Button from '@/components/atoms/button';  //Image good one next image

interface HeroData {
  title: string;
  subTitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bannerImage: string;
}
const HeroSection = ({ herodata }: { herodata: HeroData }) => {
  const { title, description, buttonText, bannerImage } = herodata;
  const isGif = bannerImage.toLowerCase().endsWith('.gif');

  return (
    <div className="mx-auto relative w-full h-screen overflow-hidden">
      {isGif ? (
        <img
          src={bannerImage}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={bannerImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      )}

      <TextHeader
        text={title}
        specialWordsIndices="2"
        align="center"
        width="100%"
        textcolor="white"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute top-[70%] md:top-[70%] lg:top-[70%] left-1/2 transform -translate-x-1/2 w-full max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-10 text-center md:text-left mb-10">
    
    {/* Left: Description */}
    <p className="text-white text-base md:text-lg max-w-[400px] mx-auto md:mx-0">
      {description}
    </p>

    {/* Right: Button */}
    <div className="flex justify-center md:justify-end">
      <Button
        text={buttonText}
        variant="secondary"
        textColor="text-white"
        className="border border-white mt-4 md:mt-0"
      />
    </div>
    
  </div>
</div>

    </div>

    
  );
};
export default HeroSection;