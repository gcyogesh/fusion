
import React from 'react';
import Image from 'next/image';
import TextHeader from '@/components/atoms/headings';
import Button from '@/components/atoms/button';  //Image good one next image
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaSearch } from 'react-icons/fa';

interface HeroData {
  title: string;
  subTitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bannerImage: string;
}
const HeroSection = ({ herodata }: { herodata: HeroData }) => {
  const { title, description, buttonText, bannerImage } = herodata;
  const isGif = bannerImage.toLowerCase().endsWith('.gif');

  return (
    <div className="mx-auto relative w-full h-[860px] ">
      {isGif ? (
        <img
          src={bannerImage}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={bannerImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      )}

      <TextHeader
        text={title}
        specialWordsIndices="2"
        align="center"
        width="100%"
        textcolor="white"
        className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute top-[72%] md:top-[73%] lg:top-[73%] left-1/2 transform -translate-x-1/2 w-full max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-10 text-center md:text-left mb-10">
    
    {/* Left: Description */}
    <p className="text-white text-base md:text-lg max-w-[486px] mx-auto  md:mx-0">
      {description}
    </p>

    {/* Right: Button */}
    <div className="flex justify-center md:justify-end">
      <Button
        text={buttonText}
        variant="secondary"
        textColor="text-white"
        className="border border-white w-[185] h-[55] mt-4 md:mt-4"
      />
    </div>
    
  </div>
</div>
<div className="absolute w-full max-w-[1100px]  mx-auto left-0 right-0 top-[97%] md:top-[96%] lg:top-[95%] z-50 px-2">
  <div className="flex items-center justify-between bg-white rounded-full px-2 sm:px-4 py-2 sm:py-3 shadow-lg gap-2 overflow-x-auto">

    {/* Location */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaMapMarkerAlt className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold">Location</span>
        <span className="text-gray-500 truncate">Enter your destination</span>
      </div>
    </div>

    {/* Date */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaCalendarAlt className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold">Date</span>
        <span className="text-gray-500 truncate">Choose your dates</span>
      </div>
    </div>

    {/* Price */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaDollarSign className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold ">Price</span>
        <span className="text-gray-500 truncate">Enter your budget</span>
      </div>
    </div>

    {/* Button */}
    <div className="flex flex-shrink-0">
      <button className="flex items-center bg-[#0E334F] text-white px-3 sm:px-4 py-1.7 sm:py-2 rounded-full font-medium hover:bg-blue-800 transition whitespace-nowrap text-xs sm:text-sm md:text-base">
        {/* Icon only on small screen */}
        <span className="block sm:hidden">
          <Image
           src="/images/mynaui_search.svg" // Make sure this is placed in /public folder
           alt="Search Icon"
           width={20}
            height={20}
            />
        </span>
        {/* Text + icon on sm and above */}
        <span className="hidden sm:flex items-center gap-3.5">
          Find My Adventure
          <span className="bg-white p-2.5  rounded-full">
        <Image
           src="/images/mynaui_search.svg" 
           alt="Search Icon"
           width={28}
            height={28}
            
            />
       </span>
        </span>
      </button>
    </div>

  </div>
</div>




    </div>

    
  );
};
export default HeroSection;