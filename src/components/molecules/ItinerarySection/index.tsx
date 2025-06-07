'use client';

import Image from "next/image";
import { FC, useState } from "react";
import { FaHiking, FaHotel, FaUtensils } from "react-icons/fa";
import { Minus, Plus } from "lucide-react";

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image?: string;
};

type Props = {
  itinerary: ItineraryItem[];
};

const ItinerarySection: FC<Props> = ({ itinerary }) => {
  const [openDay, setOpenDay] = useState<number | null>(1); // open Day 1 by default

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div className="space-y-2 bg-transparent">
      {itinerary.map((item) => {
        const isOpen = openDay === item.day;
        return (
          <div
            key={item.day}
            className={`rounded-xl border-none transition-all duration-300 ease-in-out  ${isOpen ? "bg-transparent" : ""
              }`}
          >
            
            <div className="flex items-start justify-between  relative  ">
             
              <div className="flex items-center gap-2">
                {/* Image with overlay text */}
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    src="/images/iterate/DaysCalender.png"
                    alt="Day Badge"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute  inset-0 flex flex-col items-center justify-center text-center mt-5">
                    <span className="text-[10px] font-semibold text-[#0E334F] leading-none">
                      DAY
                    </span>
                    <span className="text-md font-bold text-[#F28A15] leading-none">
                      {String(item.day).padStart(2, '0')}
                    </span>
                  </div>
                </div>

               
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => toggleDay(item.day)}
                className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
              >
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </div>

            {/* Expanded Content */}
            {isOpen && (
              <div className=" max-w-4xl px-16 pb-4">
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

                {/* Activities Section */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 items-center bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 text-xl">
                    <FaUtensils className="text-[#0E334F]" />
                    <span>Breakfast</span>
                  </div>
                  {item.activities.includes("Trekking") && (
                    <div className="flex items-center gap-1 text-xl">
                      <FaHiking className="text-[#0E334F]" />
                      <span>Trekking, Walking</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FaHotel className="text-[#0E334F] text-xl" />
                    <span>Hotel / Guesthouse</span>
                  </div>
                </div>


              </div>
            )}
          </div>
        );
      })}

      {/* Tailwind Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ItinerarySection;
