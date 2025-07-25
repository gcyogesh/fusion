'use client';

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";

const icons = [
  "/images/iterate/BreakFast.png",
  "/images/iterate/Trekking.png",
  "/images/iterate/Bed.png",
  "/images/iterate/Seasons.png",
];

const ItinerarySection = ({ itinerary }) => {
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {itinerary?.map((item) => {
        const isOpen = openDay === item.day;
        return (
          <div
            key={item.day}
            className="rounded-xl border-b border-gray-200 pb-4"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Badge and Title */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 sm:w-[60px] sm:h-[60px] flex-shrink-0">
                  <Image
                    src="/images/iterate/DaysCalender.png"
                    alt="Day Badge"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-4">
                    <span className="text-[9px] font-semibold text-[#0E334F] leading-none">DAY</span>
                    <span className="text-sm sm:text-md font-bold text-[#F28A15] leading-none">
                      {String(item.day).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <TextHeader text={item.title}  size="small" className=" !justify-left" />
                
              </div>

              {/* Right: Plus/Minus Button */}
              <div>
              <button
                onClick={() => toggleDay(item.day)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center"
              >
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </button>
               </div>
            </div>

            {/* Content */}
            {isOpen && (
              <div className="mt-4 space-y-4">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed hyphens-auto text-justify px-4 md:px-6 lg:px-6">
                  {item.description}
                </p>

                {/* Optional Image */}
                {item.image && (
                  <div className="rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={300}
                      className="w-full sm:w-[735px] h-auto object-cover rounded-xl"
                    />
                  </div>
                )}
                {/* Activities */}
                {item.activities && item.activities.length > 1 && (
                <div className="bg-white p-4 sm:p-6 border border-black rounded-xl shadow-sm">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {item.activities.map((activityText, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-gray-700 text-sm sm:text-base bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
                      >
                        <Image
                          src={icons[idx % icons.length]}
                          alt="activity icon"
                          width={20}
                          height={20}
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                        />
                        <div className="max-w-[230px] md:max-w-full">
                        <TextDescription text={activityText} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItinerarySection;
