'use client';

import React, { useRef } from "react";
import TestimonialCarousel, {
  TestimonialCarouselHandle,
} from "./testimonial";
import ArrowIcon from "@/components/atoms/arrowIcon";
import Image from "next/image";

interface TestimonialsSectionProps {
  testimonialData: any[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonialData,
}) => {
  const carouselRef = useRef<TestimonialCarouselHandle>(null);

  return (
    <section className="relative w-full">
      <div className="hidden md:block absolute top-[43%] right-4 md:right-28 -translate-y-1/2 z-20">
        <Image src="/images/quotes.svg" alt="Quotes" width={55} height={55} />
      </div>

      <div className="hidden md:block absolute top-[63%] left-4 md:left-32 -translate-y-1/2 z-20">
        <button onClick={() => carouselRef.current?.scrollPrev()} aria-label="Previous slide">
          <ArrowIcon direction="left" variant="primary" />
        </button>
      </div>

      <div>
        <TestimonialCarousel
          ref={carouselRef}
          testimonialData={testimonialData}
        />
      </div>

      <div className="hidden md:block absolute top-[63%] right-4 md:right-32 -translate-y-1/2 z-20">
        <button onClick={() => carouselRef.current?.scrollNext()} aria-label="Next slide">
          
          <ArrowIcon direction="right" variant="primary" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
