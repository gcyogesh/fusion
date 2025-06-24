'use client';

import React, { useRef, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import TextHeader from "../../atoms/headings";
import TextDescription from "@/components/atoms/description";
import ArrowIcon from "../../atoms/arrowIcon";

interface TestimonialCardProps {
  message: string;
  name: string;
  position: string;
  profileImage: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  message,
  name,
  position,
  profileImage,
  rating,
}) => {
  return (
    <div className="flex flex-col w-[90%] sm:w-[45%] lg:w-[30%] flex-shrink-0 snap-center h-[260px] bg-[#FCE1AC] rounded-xl p-4 shadow-md relative">
      <div className="text-yellow-500 flex mb-3">
        {Array(rating)
          .fill(0)
          .map((_, i) => (
            <FaStar key={i} />
          ))}
      </div>
      <TextDescription text={message} className="w-full h-[150px] font-semibold" />
      <div className="flex items-center gap-4 mt-auto">
        <img
          src={profileImage}
          className="w-10 h-10 rounded-full object-cover"
          alt={name}
        />
        <div>
          <p className="font-semibold text-[#2C2727]">{name}</p>
          <p className="text-gray-600">{position}</p>
        </div>
      </div>
    </div>
  );
};

interface TestimonialCarouselProps {
  testimoinaldata: TestimonialCardProps[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimoinaldata }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByCard = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('div');
      const cardWidth = (card as HTMLElement)?.offsetWidth || 320;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? cardWidth + 24 : -(cardWidth + 24),
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('div');
      const cardWidth = (card as HTMLElement)?.offsetWidth || 320;
      const scrollLeft = scrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + 24));
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative px-4 py-10">
      <TextHeader
        text="Memorable Journeys, Happy Clients"
        specialWordsIndices="1"
        align="center"
        width="500px"
        buttonText="Testimonials"
        className="mb-8"
      />

      {/* Left Arrow */}
      <div className="hidden md:block absolute top-[62%] left-2 md:left-8 -translate-y-1/2 z-10">
        <button onClick={() => scrollByCard('left')}>
          <ArrowIcon direction="left" variant="primary" />
        </button>
      </div>

      {/* Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="max-w-7xl flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 py-6 scrollbar-hide bg-[linear-gradient(90deg,_#FEF9EE_0.88%,_#1C9ADB_32.63%,_#0F7BBA_70.26%,_#FEF9EE_100%)]"
        style={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '60% 100%',
        }}
      >
        {testimoinaldata.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>

      {/* Right Arrow */}
      <div className="hidden md:block absolute top-[62%] right-2 md:right-8 -translate-y-1/2 z-10">
        <button onClick={() => scrollByCard('right')}>
          <ArrowIcon direction="right" variant="primary" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimoinaldata.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-orange-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
