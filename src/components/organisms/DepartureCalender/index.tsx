'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUsers, FaUser } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import React  from 'react';

import 'react-calendar/dist/Calendar.css';
import TextHeader from '@/components/atoms/headings';
import Button from '@/components/atoms/button';

export default function DepartureCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingDate = searchParams.get('bookingDate') || '';
  const travelDate = searchParams.get('travelDate') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleBookingDateChange = (date: Dayjs | null) => {
    if (date) {
      updateParam('bookingDate', date.format('YYYY-MM-DD'));
    }
  };

  const handleTravelDateChange = (date: Dayjs | null) => {
    if (date) {
      updateParam('travelDate', date.format('YYYY-MM-DD'));
    }
  };

  const handleScrollToForm = () => {
    const formSection = document.getElementById('Book-Now');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="p-2 md:p-5 lg:p-6 space-y-6 bg-white border border-[#0E334F] rounded-xl shadow-md">
      <TextHeader
        text="Select Dates"
        align="left"
        size="large"
        width={400}
        className="text-[#1A1E21]"
      />
      <div className="grid grid-cols-1 md:grid-cols-2  ">

        <div>
          <h3 className="text-lg font-semibold mb-2 text-[#0E334F]">Travel Date</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={travelDate ? dayjs(travelDate) : null} onChange={handleTravelDateChange} />
          </LocalizationProvider>
        </div>
      </div>
      <Button
        text="Choose date "
        variant="primary"
        className="bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold px-6 py-2 rounded-full text-center"
        onClick={handleScrollToForm}
      />
    </div>
  );
}
