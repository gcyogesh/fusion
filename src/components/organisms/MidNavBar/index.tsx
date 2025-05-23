
"use client"
import React, { useState } from 'react';

const tabs = [
  "Overview",
  "Itinerary",
  "Includes/Excludes",
  "Trip Map",
  "Equipments",
  "FAQs",
  "Reviews",
];

const TourNavbar = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="bg-[#FDE3B0] border-b border-[#DEBC7E] ">
      <div className="max-w-7xl mx-auto relative flex items-center py-2 ">
        {/* Tabs on the left */}
        <div className="flex ">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-semibold px-3 py-1 rounded ${
                activeTab === tab
                  ? "bg-[#F7931E] text-white"
                  : "text-black hover:bg-[#fcd59d]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Centered Title */}
     
      </div>
    </div>
  );
};

export default TourNavbar;
