"use client";
import React from "react";
import useScrollSpy from "../../../hooks/useScrollSpy";
const tabs = [
  "Overview",
  "Itinerary",
  "Includes/Excludes",
  "Trip Map",
  "Equipments",
  "FAQs",
  "Reviews",
];
const navItems = tabs.map((tab) => ({ id: tab.replace(/\s+/g, "-").replace("/", "-"), }));
const MidNavbar = () => {
  
  const { activeSection: activeTab, scrollToSection: setActiveTab } = useScrollSpy(navItems);

  return (
    <div className="sticky top-0 z-40 bg-[#FDE3B0] border-b border-[#DEBC7E]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-start gap-3 sm:gap-4 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.replace(/\s+/g, "-").replace("/", "-"))}
              className={`text-sm sm:text-base md:text-lg font-semibold px-3 py-1 rounded transition-all ${
                activeTab === (tab.replace(/\s+/g, "-").replace("/", "-"))
                  ? "bg-[#F7931E] text-white"
                  : "text-black hover:bg-[#fcd59d]"
              }`}
            >
            {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MidNavbar;
