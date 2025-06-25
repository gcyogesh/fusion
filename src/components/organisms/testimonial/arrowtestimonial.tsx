'use client';

import React, { useEffect, useRef, useState } from 'react';
import TestimonialCarousel, {TestimonialCarouselHandle } from '@/components/organisms/testimonial/testimoinal';
import ArrowIcon from '@/components/atoms/arrowIcon'
import { fetchAPI } from "@/utils/apiService"; 
import Image from 'next/image';

const TestimonialsSection = () => {
  const carouselRef = useRef<TestimonialCarouselHandle>(null);
  const [testimoinaldata, setTestimoinaldata] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAPI({ endpoint: 'testimonials' });
      setTestimoinaldata(data);
    };

    getData();
  }, []);

  return (
    <section className="relative w-full">
        <div className="hidden md:block absolute top-[43%] right-4 md:right-28 -translate-y-1/2 z-20"><Image src={"/images/quotes.svg"} alt="Location" width={55} height={55} /></div>
        
      {/* Left Arrow – hidden on sm, shown on md+ */}
      <div className="hidden md:block absolute top-[63%] left-4 md:left-32 -translate-y-1/2 z-20">
        <button onClick={() => carouselRef.current?.scrollPrev()}>
          <ArrowIcon direction="left" variant="primary" />
        </button>
      </div>

      {/* Carousel */}
      <div>
        <TestimonialCarousel ref={carouselRef} testimoinaldata={testimoinaldata} />
      </div>

      {/* Right Arrow – hidden on sm, shown on md+ */}
      <div className="hidden md:block absolute top-[63%] right-4 md:right-32 -translate-y-1/2 z-20">
        <button onClick={() => carouselRef.current?.scrollNext()}>
          <ArrowIcon direction="right" variant="primary" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
