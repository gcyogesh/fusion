'use client';

import React, { useEffect, useRef } from 'react';
import useScrollSpy from '@/hooks/useScrollSpy';

type MidNavbarProps = {
  tabs: string[];
};

const MidNavbar = ({ tabs }: MidNavbarProps) => {
  const navItems = tabs.map((tab) => ({
    id: tab.replace(/\s+/g, '-').replace('/', '-'),
  }));

  const { activeSection: activeTab, scrollToSection: setActiveTab } = useScrollSpy(navItems);

  const navRef = useRef<HTMLDivElement | null>(null);
  const navListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (navRef.current) {
      setTimeout(() => {
        navRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (navListRef.current && activeTab) {
      const activeElement = document.getElementById(`nav-${activeTab}`);
      if (activeElement) {
        navListRef.current.scrollTo({
          left: activeElement.offsetLeft - navListRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTab]);

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <div
        ref={navRef}
        className="fixed bottom-0 left-0 z-50 w-full bg-[#FDE3B0] border-t border-[#DEBC7E] md:hidden"
      >
        <div className="max-w-7xl mx-auto overflow-x-auto scroll-smooth">
          <div
            ref={navListRef}
            className="flex flex-nowrap overflow-x-auto scrollbar-none py-2 px-3"
          >
            {tabs.map((tab) => {
              const tabId = tab.replace(/\s+/g, '-').replace('/', '-');
              const isActive = activeTab === tabId;

              return (
                <button
                  key={tab}
                  id={`nav-${tabId}`}
                  onClick={() => {
                    const el = document.getElementById(tabId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveTab(tabId);
                    }
                  }}
                  className={`text-sm font-semibold px-5 py-2 transition-all whitespace-nowrap rounded-full ${
                    isActive ? 'bg-[#F7931E] text-white' : 'text-black hover:bg-[#fcd59d]'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Top Navbar */}
      <div className="hidden md:block sticky top-0 z-40 bg-[#FDE3B0] border-b border-[#DEBC7E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-start overflow-x-auto">
            {tabs.map((tab) => {
              const tabId = tab.replace(/\s+/g, '-').replace('/', '-');
              const isActive = activeTab === tabId;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    const el = document.getElementById(tabId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveTab(tabId);
                    }
                  }}
                  className={`text-sm sm:text-base md:text-lg font-semibold px-7 py-3 transition-all whitespace-nowrap rounded-full ${
                    isActive ? 'bg-[#F7931E] text-white' : 'text-black hover:bg-[#fcd59d]'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MidNavbar;