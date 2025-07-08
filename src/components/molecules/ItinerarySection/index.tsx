'use client';

import Image from "next/image";
import { FC, useState, JSX } from "react";
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

const activityMap: { keyword: string; icon: JSX.Element; label: string }[] = [
  {
    keyword: "arrival",
    icon: <FaHotel className="text-[#0E334F]" />,
    label: "Arrival",
  },
  {
    keyword: "hotel",
    icon: <FaHotel className="text-[#0E334F]" />,
    label: "Hotel",
  },
  {
    keyword: "transfer",
    icon: <FaHotel className="text-[#0E334F]" />,
    label: "Hotel Transfer",
  },
  {
    keyword: "briefing",
    icon: <FaUtensils className="text-[#0E334F]" />,
    label: "Welcome Briefing",
  },
  {
    keyword: "sightseeing",
    icon: <FaHiking className="text-[#0E334F]" />,
    label: "Sightseeing",
  },
  {
    keyword: "temple",
    icon: <FaHiking className="text-[#0E334F]" />,
    label: "Temple Visits",
  },
  {
    keyword: "trek",
    icon: <FaHiking className="text-[#0E334F]" />,
    label: "Trek Preparation",
  },
  {
    keyword: "scenic",
    icon: <FaHiking className="text-[#0E334F]" />,
    label: "Scenic Drive",
  },
  {
    keyword: "lakeside",
    icon: <FaHiking className="text-[#0E334F]" />,
    label: "Explore Lakeside",
  },

];

const ItinerarySection: FC<Props> = ({ itinerary }) => {
  const [openDay, setOpenDay] = useState<number | null>(1); // open Day 1 by default

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
            className={`rounded-xl border-none transition-all duration-300 ease-in-out  ${isOpen ? "bg-transparent" : ""
              }`}
          >

            <div className="flex items-start justify-between  relative  ">

              <div className="flex items-center py-2 ">
                {/* Image with overlay text */}
                <div className="relative w-[60px] h-[60px] ">
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


                <h1 className="text-xl font-semibold text-gray-900 px-2">
                  {item.title}
                </h1>
              </div>

              {/* Toggle Button */}
              <button 
                onClick={() => toggleDay(item.day)}
                className="w-10 h-10  bg-primary text-white rounded-full flex items-center justify-center mt-4"
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
              <div className="mt-4 overflow-x-auto">
                <div className="inline-flex min-w-[600px] sm:min-w-full bg-white p-5 border border-black rounded-xl shadow-sm">
  <div className="flex flex-wrap sm:flex-nowrap items-center text-xl text-gray-600 gap-3">
    {item.activities.map((activityText, idx) => {
      const matched = activityMap.find(({ keyword }) =>
        activityText.toLowerCase().includes(keyword)
      );

      return (
        <div
          key={idx}
          className="flex items-center gap-1 sm:gap-3 text-xl whitespace-nowrap mr-2 sm:mr-4 mb-1 sm:mb-2"
        >
          {matched ? (
            <>
              {matched.icon}
              <span>{activityText}</span>
            </>
          ) : (
            <>
              <span className="text-[#0E334F] font-bold">•</span>
              <span>{activityText}</span>
            </>
          )}
        </div>
      );
    })}
  </div>
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
