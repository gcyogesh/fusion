import React from 'react';
import TextHeader from '@/components/atoms/headings';
import Image from 'next/image';
const  HeroBanner = ({herodata}) => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Background Image */}
      <img
        src={herodata.bannerImage}
        alt="Traveling Couple"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <Image src={herodata.image} alt={herodata.title} />

      {/* Overlay */}


      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <div>
     <TextHeader text={herodata.title} width={200} specialWordsIndices='3' />
          
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
