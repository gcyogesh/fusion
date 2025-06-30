'use client';

import React from "react";
import { FaStar } from "react-icons/fa";

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
  <div className="bg-[#FCE1AC] rounded-xl p-6 shadow-md max-w-md mx-auto">
    <div className="flex text-yellow-500 mb-3">
      {Array(rating)
        .fill(0)
        .map((_, i) => (
          <FaStar key={i} />
        ))}
    </div>
    <p className="text-[#1A1E21] font-semibold mb-4">{message}</p>
    <div className="flex items-center gap-4">
      <img
        src={profileImage}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
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
