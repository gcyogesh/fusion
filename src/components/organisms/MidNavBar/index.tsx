"use client";
import React from "react";
import useScrollSpy from "../../../hooks/useScrollSpy";

type MidNavbarProps = {
  tabs: string[];
};

const MidNavbar = ({ tabs }: MidNavbarProps) => {
  const navItems = tabs.map((tab) => ({
    id: tab.replace(/\s+/g, "-").replace("/", "-"),
  }));

  const { activeSection: activeTab, scrollToSection: setActiveTab } = useScrollSpy(navItems);

  return (
    <div className="sticky top-0 z-40 bg-[#FDE3B0] border-b border-[#DEBC7E]">
      <div className="max-w-7xl mx-auto  py-0">
        <div className="flex flex-wrap justify-start ">
          {tabs.map((tab) => {
            const tabId = tab.replace(/\s+/g, "-").replace("/", "-");
            const isAllBlogs = tab.toLowerCase() === "all blogs";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabId)}
                className={`text-sm sm:text-base md:text-lg font-semibold px-7 py-3 transition-all ${
                  isAllBlogs
                    ? "bg-[#F7931E] text-white rounded-full hover:bg-[#e67e00]"
                    : `rounded ${
                        activeTab === tabId
                          ? "bg-[#F7931E] text-white"
                          : "text-black hover:bg-[#fcd59d]"
                      }`
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MidNavbar;
