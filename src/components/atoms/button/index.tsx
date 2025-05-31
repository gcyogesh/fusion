import React from "react";
interface ButtonProps<T = unknown> {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, extra?: T) => void;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  variant?: "primary" | "secondary";
  extraData?: T;
  className?: string;
  borderColor?: string; // Accept Tailwind or custom border classes like "border-red-500"
  textColor?: string;   // Accept Tailwind or custom text classes like "text-blue-600" alright
}

const Button = <T,>({
  text,
 
  className = "",
  leftIcon,
  rightIcon,
  variant = "primary",

  borderColor,
  textColor,
}: ButtonProps<T>) => {
  const variants = {
    primary: {
      bg: "bg-primary",
      text: "text-white",
      border: "border-transparent",
      hoverBg: "hover:bg-[#e67c10]",
      hoverBorder: "hover:border-orange-700",
    },
    secondary: {
      bg: "bg-transparent",
      text: "text-black",
      border: "border border-[#00000033]",
      hoverBg: "hover:bg-gray-200",
      hoverBorder: "hover:border-gray-500",
    },
  };

  const baseClasses =
    "px-[40px] py-[10px] rounded-[32px] flex justify-center items-center transition-all gap-[10px] duration-300 group relative cursor-pointer";

  return (
    <button
      type="button"
      className={`
        ${baseClasses} 
        ${variants[variant].bg} 
        ${textColor || variants[variant].text} 
        ${borderColor || variants[variant].border} 
        ${variants[variant].hoverBg} 
        ${variants[variant].hoverBorder} 
        ${className}
      `}
    >
      {leftIcon && (
        <span className="mr-2">
          {typeof leftIcon === "string" ? (
            <img src={leftIcon} alt="left-icon" className="w-5 h-5" />  //cgbasdf asfs asdf
          ) : (
            leftIcon
          )}
        </span>
      )}
      {text}
      {rightIcon && (
        <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {typeof rightIcon === "string" ? (
            <img src={rightIcon} alt="right-icon" className="w-5 h-5" />
          ) : (
            rightIcon
          )}
        </span>
      )}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 hover:bg-transparent"></div>
    </button>
  );
};

export default Button;
