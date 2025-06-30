'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type MidNavbarProps = {
  tabs: { label: string; value: string }[];
  isBlogPage?: boolean; // Use this to control filtering logic
};

const MidNavbar = ({ tabs, isBlogPage = false }: MidNavbarProps) => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const navListRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    if (navRef.current) {
      setTimeout(() => {
        navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (navListRef.current) {
      const activeElement = document.getElementById(`nav-${activeCategory}`);
      if (activeElement) {
        navListRef.current.scrollTo({
          left: activeElement.offsetLeft - navListRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [activeCategory]);

  const handleTabClick = (value: string) => {
    const current = new URLSearchParams(searchParams.toString());
    if (isBlogPage) {
      if (value === 'all') {
        current.delete('category');
      } else {
        current.set('category', value);
      }
      current.delete('page'); // Reset to page 1 on tab change
      router.push(`/blogs?${current.toString()}`);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <div
        ref={navRef}
        className="fixed bottom-0 left-0 z-50 w-full bg-[#FDE3B0] border-t border-[#DEBC7E] md:hidden"
      >
        <div className="max-w-7xl mx-auto overflow-x-auto scroll-smooth">
          <div ref={navListRef} className="flex flex-nowrap overflow-x-auto scrollbar-none py-2 px-3">
            {tabs.map((tab) => {
              const isActive = activeCategory === tab.value;

              return (
                <button
                  key={tab.value}
                  id={`nav-${tab.value}`}
                  onClick={() => handleTabClick(tab.value)}
                  className={`text-sm font-semibold px-5 py-2 transition-all whitespace-nowrap rounded-full ${
                    isActive ? 'bg-[#F7931E] text-white' : 'text-black hover:bg-[#fcd59d]'
                  }`}
                >
                  {tab.label}
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
              const isActive = activeCategory === tab.value;

              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={`text-sm sm:text-base md:text-lg font-semibold px-7 py-3 transition-all whitespace-nowrap rounded-full ${
                    isActive ? 'bg-[#F7931E] text-white' : 'text-black hover:bg-[#fcd59d]'
                  }`}
                >
                  {tab.label}
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
