"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Variant = 'rectangle' | 'square' | 'smallsquare' | 'smallrectangle';
type SnippetPosition = 'center' | 'start' | 'end';

interface ImageDisplayProps<T = string> {
  src?: T;
  alt?: string;
  className?: string;
  placeholderSrc?: T;
  variant?: Variant;
  height?: number | string;
  width?: number | string;
  snippet?: string;
  snippetPosition?: SnippetPosition;
  secondSnippet?: React.ReactNode;
  secondSnippetPosition?: SnippetPosition;
  title?: string;
  description?: string;
  showOverlayContent?: boolean;
}

const aspectRatios = {
  rectangle: 820 / 590,
  square: 408 / 430,
  smallsquare: 454 / 400,
  smallrectangle: 408 / 236,
};

const getSnippetPositionClasses = (position: SnippetPosition) => {
  switch (position) {
    case 'start':
      return 'top-2 left-2 md:top-4 md:left-4';
    case 'end':
      return 'bottom-2 right-2 md:bottom-4 md:right-4';
    case 'center':
    default:
      return 'top-2 left-1/2 -translate-x-1/2 md:top-4';
  }
};

const ImageDisplay = <T extends string>({
  src,
  alt = 'Image',
  className = '',
  placeholderSrc,
  variant = 'square',
  height,
  width,
  snippet,
  snippetPosition = 'start',
  secondSnippet,
  secondSnippetPosition = 'end',
  title,
  description,
  showOverlayContent = true,
}: ImageDisplayProps<T>) => {
  const [isError, setIsError] = useState(false);
  const shouldShowPlaceholder = isError || !src;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-xl group w-full ${className}`}
      style={{
        aspectRatio: `${aspectRatios[variant].toFixed(3)}`,
        maxWidth: width || '100%',
        maxHeight: height || 'none',
      }}
    >
      {shouldShowPlaceholder ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          {placeholderSrc ? (
            <img
              src={placeholderSrc}
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm md:text-base">Image not available</span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setIsError(true)}
        />
      )}

      {showOverlayContent && (
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-center mt-1 px-4">
              {description}
            </p>
          )}
          <div className="mt-4 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500">
            <span className="text-white text-sm">↗</span>
          </div>
        </div>
      )}

      {snippet && (
        <div
          className={`absolute z-10 text-white text-xs md:text-sm font-semibold px-2 py-1 md:px-4 md:py-2 bg-orange-500 rounded-lg ${getSnippetPositionClasses(
            snippetPosition
          )}`}
        >
          {snippet}
        </div>
      )}

      {secondSnippet && (
        <div
          className={`absolute z-10 text-white text-xs md:text-sm font-medium ${getSnippetPositionClasses(
            secondSnippetPosition
          )}`}
        >
          {secondSnippet}
        </div>
      )}
    </motion.div>
  );
};

export default ImageDisplay;
