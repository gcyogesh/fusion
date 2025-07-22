'use client';

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";

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
    <div className="space-y-2 bg-transparent px-4">
      {itinerary.map((item) => {
        const isOpen = openDay === item.day;
        return (
          <div
            key={item.day}
            className={`rounded-xl border-none transition-all duration-300 ease-in-out ${isOpen ? "bg-transparent" : ""}`}
          >
            <div className="flex items-start justify-between relative">
              <div className="flex items-center py-2">
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    src="/images/iterate/DaysCalender.png"
                    alt="Day Badge"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-5">
                    <span className="text-[10px] font-semibold text-[#0E334F] leading-none">DAY</span>
                    <span className="text-md font-bold text-[#F28A15] leading-none">
                      {String(item.day).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 px-2">{item.title}</h1>
              </div>

              <button
                onClick={() => toggleDay(item.day)}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mt-4"
              >
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </div>

            {isOpen && (
              <div className="max-w-4xl px-16 pb-4">
                <p className="text-base text-gray-700">{item.description}</p>

                {item.image && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={300}
                      className="w-[735px] h-auto object-cover rounded-xl"
                    />
                  </div>
                )}
                <div className="mt-4">
                  <div className="w-full bg-white p-4 sm:p-6 border border-black rounded-xl shadow-sm">
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {item.activities.map((activityText, idx) => (
                        <div
                          key={idx}
                          className="flex  gap-2 text-gray-700 text-sm sm:text-base bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
                        >
                          <Image
                            src={icons[idx % icons.length]}
                            alt="activity icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                          />
                          <TextDescription text={activityText}  />
                         
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItinerarySection;