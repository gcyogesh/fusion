'use client';

import React, { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import TextDescription from "@/components/atoms/description";

export interface TestimonialCardProps {
  message: string;
  name: string;
  position: string;
  profileImage: string;
  rating: number;
}

interface TestimonialListProps {
  testimonialData: TestimonialCardProps[];
  className?: string;
}

const LINE_HEIGHT = 24; // px, adjust as per your font/line height
const LINES_PER_STEP = 4;

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  message,
  name,
  position,
  profileImage,
  rating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [maxScrollSteps, setMaxScrollSteps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.scrollHeight;
      const scrollableHeight = contentHeight - containerHeight;

      if (scrollableHeight <= 0) {
        setMaxScrollSteps(0);
      } else {
        const stepHeight = LINE_HEIGHT * LINES_PER_STEP;
        const steps = Math.ceil(scrollableHeight / stepHeight);
        setMaxScrollSteps(steps);
        setCurrentStep(0);
      }
    }
  }, [message]);

  const handleSeeMore = () => {
    setCurrentStep((prev) => Math.min(prev + 1, maxScrollSteps));
  };

  const handleSeeLess = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col w-[90vw] sm:w-[300px] md:w-[365px] lg:w-[360px] h-[250px] bg-light-beige rounded-xl p-6 snap-center flex-shrink-0 shadow-md relative">
      <div className="text-yellow-500 flex mb-5">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[96px] overflow-hidden mb-2"
      >
        <div
          ref={contentRef}
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(-${currentStep * LINE_HEIGHT * LINES_PER_STEP}px)`,
          }}
        >
          <TextDescription
            text={message}
            className="font-semibold text-sm !text-[#1A1E21] leading-[24px] whitespace-pre-wrap"
          />
        </div>
      </div>

      {maxScrollSteps > 0 && (
        <div className="flex justify-end gap-3 mb-2 text-sm text-gray-400">
          {currentStep > 0 && (
            <button
              onClick={handleSeeLess}
              className="underline hover:text-gray-600"
            >
              See Less
            </button>
          )}
          {currentStep < maxScrollSteps && (
            <button
              onClick={handleSeeMore}
              className="underline hover:text-gray-600"
            >
              See More
            </button>
          )}
        </div>
      )}

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

const TestimonialList: React.FC<TestimonialListProps> = ({
  testimonialData,
  className,
}) => (
  <div className={`flex gap-5 flex-wrap justify-start ${className ?? ""}`}>
    {testimonialData.map((item, idx) => (
      <TestimonialCard key={idx} {...item} />
    ))}
  </div>
);

export default TestimonialList;
