'use client';

import React from "react";
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

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  message,
  name,
  position,
  profileImage,
  rating,
}) => (
  <div className="flex flex-col w-[90vw] sm:w-[300px] md:w-[365px] lg:w-[360px] h-[250px] bg-[#FCE1AC] rounded-xl p-6 snap-center flex-shrink-0 shadow-md relative">
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

const TestimonialList: React.FC<TestimonialListProps> = ({
  testimonialData,
  className,
}) => (
  <div className={`flex gap-5 flex-wrap justify-center ${className ?? ""}`}>
    {testimonialData.map((item, idx) => (
      <TestimonialCard key={idx} {...item} />
    ))}
  </div>
);

export default TestimonialList;
