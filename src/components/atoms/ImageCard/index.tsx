"use client";

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import ArrowIcon from '../arrowIcon';
import Button from '../button';
import Image from 'next/image';
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
  showDefaultTitle?: boolean;
  description?: string;
  showOverlayContent?: boolean;
  totalTrips?: number;
  createdAt?: string;
}

const aspectRatios = {
  rectangle: 820 / 590,
  square: 408 / 430,
  smallsquare: 450 / 370,
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


const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
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
  showDefaultTitle,
  description,
  totalTrips,
  createdAt,
  showOverlayContent = true,
}: ImageDisplayProps<T>) => {
  const [isError, setIsError] = useState(false);
  const shouldShowPlaceholder = isError || !src;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl group w-full cursor-pointer ${className}`}
      style={{
        aspectRatio: `${aspectRatios[variant].toFixed(3)}`,
        maxWidth: width || '100%',
        maxHeight: height || 'none',
      }}
    >
      {shouldShowPlaceholder ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          {placeholderSrc ? (
            <Suspense fallback={<span className="text-gray-400 text-sm md:text-base">Loading image...</span>}>
              <Image
                src={placeholderSrc}
                alt="Placeholder"
                fill
                style={{ objectFit: 'cover' }}
                fetchPriority="low"
                loading="lazy"
                onError={() => setIsError(true)}
              />
            </Suspense>
          ) : (
            <span className="text-gray-400 text-sm md:text-base">Image not available</span>
          )}
        </div>
      ) : (
        <Suspense fallback={<span className="text-gray-400 text-sm md:text-base">Loading image...</span>}>
          <Image
            src={src as string}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setIsError(true)}
          />
        </Suspense>
      )}

      {showOverlayContent && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 cursor-pointer px-4 text-center"
        >
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
          {description && (
            <p className="text-sm mt-1 line-clamp-3">
              {description}
            </p>
          )}

          <div className="mt-4 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500">
            <ArrowIcon size={15} />
          </div>
        </motion.div>
      )}

      {createdAt && (
        <div className="absolute bottom-2 left-2  flex   items-center  backdrop-blur-md bg-white/20  text-md text-gray-200 px-6 py-2 m-3 border border-white/40 rounded-full">
          <Image src="/images/calender.png" width={25} height={25} alt="Image nnot found" className='mr-1.5 ' fetchPriority="low" loading="lazy" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      )}

      {typeof totalTrips === 'number' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <button
            className=" text-[#ffffff] text-base font-semibold px-6 py-2 bg-primary rounded-lg"
          >
            {`${totalTrips} Trips`}
          </button>
        </div>
      )}

      {title && showDefaultTitle && (
        <div className="absolute bottom-4 left-0 w-full text-center px-4 py-3  from-black/70 to-transparent group-hover:opacity-0 transition-opacity duration-300 text-lg ">
          <h1 className="text-white text-sm md:text-lg font-semibold">{title}</h1>
        </div>
      )}

      {snippet && (
        <div
          className={`absolute z-10 text-[#ffffff] text-xs md:text-sm font-semibold px-6 py-4 md:px-4 md:py-2 bg-primary rounded-lg ${getSnippetPositionClasses(
            snippetPosition
          )}`}
        >
          {snippet}
        </div>
      )}

      {secondSnippet && (
        <div
          className={`absolute z-10 text-[#ffffff] text-xs md:text-sm font-medium ${getSnippetPositionClasses(
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
