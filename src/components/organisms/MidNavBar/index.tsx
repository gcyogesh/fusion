"use client";
import React, { useState } from "react";

const tabs = [
  "Overview",
  "Itinerary",
  "Includes/Excludes",
  "Trip Map",
  "Equipments",
  "FAQs",
  "Reviews",
];

const MidNavbar = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="bg-[#FDE3B0] border-b border-[#DEBC7E]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-start gap-3 sm:gap-4 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm sm:text-base md:text-lg font-semibold px-3 py-1 rounded transition-all ${
                activeTab === tab
                  ? "bg-[#F7931E] text-white"
                  : "text-black hover:bg-[#fcd59d]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MidNavbar;
