import React from 'react';
import TextHeader from '@/components/atoms/headings';
import Image from 'next/image';
const  HeroBanner = ({herodata}) => {
  return (
    <section className="relative z-0  w-full h-[500px] md:h-[720px] lg:h-[800px]">
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
    </section>
  );
};

export default HeroBanner;
