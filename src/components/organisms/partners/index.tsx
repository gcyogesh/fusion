"use client";

import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <TextHeader
        text="Proudly Partnered With"
        specialWordsIndices="1"
        align="center"
        className="mb-6"
        width={350}
      />

      {/* Small logos (default view) */}
      {!isHovered && (
        <div
          className="flex flex-wrap justify-center items-center gap-10 "
          onMouseEnter={() => setIsHovered(true)}
        >
          {partnersdata.map((partner, idx) => (
            <div key={idx} className="w-30 h-20 relative ">
              <img
                src={partner.images.small}
                alt={`${partner.title} small logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* Big logos shown together in one big container */}
      {isHovered && (
        <div
          className="flex flex-wrap justify-center items-center gap-10 max-w-5xl mx-auto transition-all duration-300 "
          onMouseLeave={() => setIsHovered(false)}
        >
          {partnersdata.map((partner, idx) => (
            <div key={idx} className="max-w-5xl w-50 h-30 relative">
              <img
                src={partner.images.big}
                alt={`${partner.title} big logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerSection;
