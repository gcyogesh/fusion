"use client";

import React from 'react';
import TextHeader from '@/components/atoms/headings';

interface Partner {
  images: {
    small: string;
    big: string;
  };
  title: string;
}

interface PartnerSectionProps {
  partnersdata: Partner[];
}

const PartnerSection = ({ partnersdata }: PartnerSectionProps) => {
  return (
    <div>
      <TextHeader
        text="Proudly Partnered With"
        specialWordsIndices="1"
        align="center"
        className="mb-6"
        width={350}
      />
      <div className="flex flex-wrap justify-center items-center gap-10">
        {partnersdata.map((partner, idx) => (
          <div key={idx} className="relative w-40 h-16 group">
            {/* Small image */}
            <img
              src={partner.images.small}
              alt={`${partner.title} small logo`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Big image */}
            <img
              src={partner.images.big}
              alt={`${partner.title} big logo`}
              className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerSection;
