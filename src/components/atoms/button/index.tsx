'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps<T = unknown> {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, extra?: T) => void;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  variant?: 'primary' | 'secondary';
  extraData?: T;
  className?: string;
  borderColor?: string;
  textColor?: string;
  buttonLink?: string;
  disableHover?: boolean; // ✅ New prop
}

const Button = <T,>({
  text,
  onClick,
  className = '',
  leftIcon,
  rightIcon,
  variant = 'primary',
  borderColor,
  textColor,
  extraData,
  buttonLink,
  disableHover = false,
}: ButtonProps<T>) => {
  const variants = {
    primary: {
      bg: 'bg-primary',
      text: 'text-white',
      border: 'border-transparent',
      hoverBg: 'hover:bg-gradient-to-r from-[#D35400] to-[#A84300]',
      hoverBorder: 'hover:border-orange-700',
    },
    secondary: {
      bg: 'bg-transparent',
      text: 'text-black',
      border: 'border border-[#00000033]',
      hoverBg: 'hover:bg-gradient-to-r from-[#D35400] to-[#A84300]',
      hoverBorder: 'hover:border-gray-500',
    },
  };

  const baseClasses =
    'px-[40px] py-[10px] rounded-[32px] flex justify-center items-center transition-all gap-[10px] duration-300 group relative cursor-pointer';

  const content = (
    <div
      className={`
        ${baseClasses} 
        ${variants[variant].bg} 
        ${textColor || variants[variant].text} 
        ${borderColor || variants[variant].border} 
        ${!disableHover ? variants[variant].hoverBg : ''} 
        ${!disableHover ? variants[variant].hoverBorder : ''} 
        ${className}
      `}
    >
      {leftIcon && (
        <span className="mr-2">
          {typeof leftIcon === 'string' ? (
            <img src={leftIcon} alt="left-icon" className="w-5 h-5" />
          ) : (
            leftIcon
          )}
        </span>
      )}
      {text}
      {rightIcon && (
        <span
          className={`${
            !disableHover
              ? 'absolute right-4 opacity-0 group-hover:opacity-100'
              : ''
          } transition-opacity duration-300`}
        >
          {typeof rightIcon === 'string' ? (
            <img src={rightIcon} alt="right-icon" className="w-5 h-5" />
          ) : (
            rightIcon
          )}
        </span>
      )}
      {!disableHover && (
        <div className="absolute right-0 top-0 bottom-0 w-1/4 hover:bg-transparent"></div>
      )}
    </div>
  );

  return buttonLink ? (
    <Link href={buttonLink} className="inline-block">
      {content}
    </Link>
  ) : (
    <button
      type="button"
      onClick={(e) => onClick?.(e, extraData)}
      className="relative"
    >
      {content}
    </button>
  );
};

export default Button;
