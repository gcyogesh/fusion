'use client';

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaStar } from 'react-icons/fa';
import TextHeader from '@/components/atoms/headings';
import TextDescription from '@/components/atoms/description';
import { TestimonialCardProps } from './testimonialList';
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  message,
  name,
  position,
  profileImage,
  rating,
}) => (
  <div className="flex flex-col w-[90vw] sm:w-[300px] md:w-[365px] lg:w-[360px] h-[250px] bg-light-beige rounded-xl p-6 snap-center flex-shrink-0 shadow-md relative">
    <div className="text-yellow-500 flex mb-5">
      {Array.from({ length: rating }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
    <TextDescription
      text={message}
      className="w-full h-[150px] font-semibold text-sm !text-[#1A1E21]"
    />
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

interface TestimonialCarouselProps {
  testimonialData: TestimonialCardProps[];
  isReviewPage?: boolean;
}

export interface TestimonialCarouselHandle {
  scrollPrev: () => void;
  scrollNext: () => void;
}

const TestimonialCarousel = forwardRef<TestimonialCarouselHandle, TestimonialCarouselProps>(
  ({ testimonialData, isReviewPage = false }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useImperativeHandle(ref, () => ({ scrollPrev, scrollNext }), [scrollPrev, scrollNext]);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;
      emblaApi.on('select', onSelect);
      onSelect();
    }, [emblaApi, onSelect]);

    return (
      <div className="relative w-full max-w-6xl mx-auto px-4 py-10 overflow-hidden z-0">
        {!isReviewPage && (
          <TextHeader
            text="Memorable Journeys, Happy Clients"
            specialWordsIndices="1"
            align="center"
            width="500px"
            buttonText="Testimonials"
            className="mb-8"
          />
        )}

        <div
          className={`relative w-full py-4 ${
            isReviewPage
              ? ''
              : 'bg-[linear-gradient(90deg,_#FEF9EE_0.88%,_#1C9ADB_32.63%,_#0F7BBA_70.26%,_#FEF9EE_100%)] sm:bg-[linear-gradient(90deg,_#FEF9EE_0.88%,_#0F7BBA_50%,_#FEF9EE_100%)] md:bg-[linear-gradient(90deg,_#FEF9EE,_#1C9ADB,_#FEF9EE)]'
          }`}
          ref={emblaRef}
        >
          <div className="flex gap-5 px-3 py-2">
            {testimonialData.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </div>
        </div>

        {!isReviewPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonialData.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'bg-orange-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default TestimonialCarousel;
