// components/TextDescription.tsx
import React from 'react';

interface TextDescriptionProps {
  text: string;
  className?: string;
}

const TextDescription: React.FC<TextDescriptionProps> = ({ text, className = '' }) => {
  return (
    <p
      className={`font-dm-sans font-normal hyphens-auto text-[#1A1E21] opacity-80 text-justify-balance ${className}`}
    >
      {text}
    </p>
  );s
};

export default TextDescription;

