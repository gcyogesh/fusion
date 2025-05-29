import React from 'react';
import TextHeader from '@/components/atoms/headings';
import Image from 'next/image';
const  HeroBanner = ({herodata}) => {
  return (
    <div className=" relative z-30 top-6  w-full h-[500px] md:h-[610px] lg:h-[610px]">
      {/* Background Image */}
      <img
        src={herodata.bannerImage}
        alt="Traveling Couple"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <Image src={herodata.image} alt={herodata.title} />

      {/* Overlay */}


      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white">
        <div>
     <TextHeader text={herodata.title} textcolor='white' width={450} specialWordsIndices='4' />
          
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
