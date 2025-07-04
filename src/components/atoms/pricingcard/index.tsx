"use client";

import Button from '@/components/atoms/button';
import Link from 'next/link';
import React from 'react';

interface PricingCardProps {
  basePrice: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ basePrice }) => {
  function handleBookNowClick() {
    const el = document.getElementById('user-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <aside className="w-auto px-6 mb-6 md:mb-0 lg:mb-0 md:px-0 lg:px-0 ">
      <div className="sticky top-24 w-full">
        <div className="max-w-xs flex flex-col items-center rounded-xl border border-black bg-white shadow p-1 text-center space-y-3">
          <div className="bg-[#002D62] text-white p-2 h-[45px] w-[300px] text-xl font-medium rounded-xl">Best Price</div>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-gray-700 font-semibold text-xl">USD</p>
            <p className="text-4xl font-bold text-gray-800">{basePrice}</p>
            <p className="text-sm leading-tight">
              <span>Per</span>
              <span>Person</span>
            </p>
          </div>
          <hr className="border-t border-dashed border-gray-300 w-full" />
          <p className="text-base text-gray-500">
            Price May Vary According<br />To The Group Size.
          </p>
          <div className="py-4 space-y-2 pb-4 items-center flex flex-col">
            <Button text="Book this Trip" variant="primary" className="text-xs sm:text-sm w-[175px] h-[42px] font-semibold" onClick={handleBookNowClick} />
            <Link  href="/contact" className="w-full">
              <Button text="Make an Enquiry" variant="secondary" className="text-xs sm:text-sm border border-black text-[#0E334F] !p-[10px] w-[175px] h-[42px] font-medium" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PricingCard; 