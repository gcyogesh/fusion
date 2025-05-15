'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import Button from '../button';

type TextAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
type TextSize = 'medium' | 'small';
type TextHeaderType = 'main' | 'default';

interface TextHeaderProps<TSpecialIndices = string> {
  text?: string;
  align?: TextAlign;
  className?: string;
  width?: string | number;
  specialWordsIndices?: TSpecialIndices;
  size?: TextSize;
  buttonText?: string;
  textcolor?: string;
  type?: TextHeaderType;
}

const TextHeader = <TSpecialIndices extends string = string>({
  text = '',
  align = 'center',
  className = '',
  width = '100%',
  specialWordsIndices = '' as TSpecialIndices,
  size = 'medium',
  buttonText,
  textcolor = '',
  type = 'default',
}: TextHeaderProps<TSpecialIndices>) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: '-10% 0px -10% 0px',
  });

  const validText = typeof text === 'string' ? text : '';

  const baseFontStyles = {
    medium: {
      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
      lineHeight: 1.1,
    },
    small: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      lineHeight: 1.6,
    },
  };

  const baseStyle: React.CSSProperties = {
    textAlign: align,
    fontFamily: 'DM Sans, sans-serif',
    color: textcolor || '#2C2727',
    fontWeight: 600,
    letterSpacing: '-0.03em',
    ...baseFontStyles[size],
  };

  const specialStyle: React.CSSProperties = {
    fontFamily: 'Playfair Display, serif',
    color: textcolor || '#2C2727',
    fontWeight: 500,
    fontStyle: 'italic',
    letterSpacing: '-0.03em',
    ...baseFontStyles[size],
  };

  const specialIndices = specialWordsIndices
    ? (specialWordsIndices as string)
        .split(',')
        .map((index) => parseInt(index.trim(), 10))
        .filter((index) => !isNaN(index))
    : [];

  const words = validText.split(' ');

  const isNumberText = !isNaN(Number(text)) && text.trim() !== '';
  const [displayNumber, setDisplayNumber] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView && isNumberText) {
      const controls = animate(motionValue, Number(text), {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayNumber(Math.floor(v)),
      });

      return controls.stop;
    }
  }, [isInView, text]);

  const renderText = () => {
    if (isNumberText) {
      return (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={baseStyle}
        >
          {displayNumber}
        </motion.span>
      );
    }

    return words.map((word, index) => {
      const isSpecial = specialIndices.includes(index);
      return (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            delay: index * 0.07,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={isSpecial ? specialStyle : {}}
        >
          {word}{' '}
        </motion.span>
      );
    });
  };

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
    justify: 'items-stretch text-justify',
    start: 'items-start text-left',
    end: 'items-end text-right',
  }[align];

  return (
    <div
      ref={ref}
      className={`flex flex-col ${alignmentClass} ${
        align === 'center' ? 'mx-auto' : ''
      } ${className} 
      max-w-[90%] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px]`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      {buttonText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-2"
        >
          <Button
            text={buttonText}
            variant="secondary"
            textColor="text-primary"
            className="text-sm md:text-base"
          />
        </motion.div>
      )}
      <motion.h1
        className={`text-header ${type === 'main' ? 'mb-4 md:mb-6' : 'mb-0'} ${className}`}
        style={baseStyle}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {renderText()}
      </motion.h1>
    </div>
  );
};

export default TextHeader;
