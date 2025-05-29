// components/TextDescription.tsx
import React from 'react';

interface TextDescriptionProps {
  text: string;
  className?: string;
}

const TextDescription: React.FC<TextDescriptionProps> = ({ text, className = '' }) => {
  return (
    <p
      className={` font-normal text-[16px] leading-[24px] mt-2 mb-2  font-dm-sans !${className}`}
    >
      {text}
    </p>
  );
};

export default TextDescription;
