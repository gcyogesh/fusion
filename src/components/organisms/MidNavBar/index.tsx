'use client';

import React from 'react';
import useScrollSpy from '@/hooks/useScrollSpy';

type MidNavbarProps = {
  tabs: string[];
};

const MidNavbar = ({ tabs }: MidNavbarProps) => {
  const navItems = tabs.map((tab) => ({
    id: tab.replace(/\s+/g, '-').replace('/', '-'),
  }));

  const { activeSection: activeTab, scrollToSection: setActiveTab } = useScrollSpy(navItems);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTab(id); // optional: sync scroll manually
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-[#FDE3B0] border-b border-[#DEBC7E]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-start overflow-x-auto">
          {tabs.map((tab) => {
            const tabId = tab.replace(/\s+/g, '-').replace('/', '-');
            const isActive = activeTab === tabId;

            return (
              <button
                key={tab}
                onClick={() => handleScrollTo(tabId)}
                className={`text-sm sm:text-base md:text-lg font-semibold px-7 py-3 transition-all whitespace-nowrap rounded-full
                  ${isActive ? 'bg-[#F7931E] text-white' : 'text-black hover:bg-[#fcd59d]'}`}
              >
                {tab.replace('-', ' ')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MidNavbar;
