// components/TextDescription.tsx
import React from 'react';

interface TextDescriptionProps {
  text: string;
  className?: string;
}

const TextDescription: React.FC<TextDescriptionProps> = ({ text, className = '' }) => {
  return (
    <p
      className={`font-dm-sans font-normal    ${className}`}
    >
      {text}
    </p>
  );
};

export default TextDescription;
