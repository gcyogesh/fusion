import React from 'react';
import TextHeader from '@/components/atoms/headings';

interface Partner {
  image: string;
  title: string;
}

interface PartnerSectionProps {
  partnersdata: Partner[];
}

const PartnerSection = ({ partnersdata }: PartnerSectionProps) => {
  return (
    <section className='mb-20' >
      <TextHeader
        text="Proudly Partnered With"
        specialWordsIndices="1"
        align="center"
        className="mb-6"
        width={350}
      />
      <div className="flex flex-wrap justify-center items-center gap-10">
        {partnersdata.map((partner, idx) => (
          <a
            key={idx}
            href={partner.image}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={partner.image}
              alt={`${partner.title} logo`}
              className="h-16 object-contain  hover:grayscale-0 transition duration-300"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PartnerSection;
