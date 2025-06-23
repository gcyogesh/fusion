// components/molecules/StatCard.tsx
'use client';

import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import TextHeader from "../../atoms//headings";
import TextDescription from "../../atoms/description";

type StatCardProps = {
  iconSrc: string;
  title: string;
  subtitle: string;
  description: string;
};

const StatCard = ({ iconSrc, title, subtitle, description }: StatCardProps) => {
  const numericTitle = parseInt(title.replace(/\D/g, '')); // Extract number only
  const suffix = title.replace(/[0-9]/g, ''); // Keep only non-digits

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.4, 
  });

  return (
    <div ref={ref} className="text-left">
      <div className="flex items-center space-x-2">
        <Image src={iconSrc} alt={subtitle} width={46} height={46} className="text-[#002B45]" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#0E334F]">
          {inView ? (
            <CountUp start={0} end={numericTitle} duration={2} suffix={suffix} />
          ) : (
            `0${suffix}`
          )}
        </h1>
      </div>

      <TextHeader
        text={subtitle}
        size="small"
        align="left"
        width="100%"
        className="text-gray-600"
      />

      <TextDescription
        text={description}
        className="text-left w-[239px]"
      />
    </div>
  );
};

export default StatCard;
