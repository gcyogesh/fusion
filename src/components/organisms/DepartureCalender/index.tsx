'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUsers, FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

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
    <div className="relative overflow-hidden bg-white border-[#0E334F]/10 rounded-2xl">
      
     
      
      <div className="relative p-8 md:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
         
          
          <TextHeader
            text="Select Your Travel Date"
            align="left"
            size="large"
            width={400}
            className="text-[#1A1E21] font-bold"
          />
          
         
        </div>

        {/* Calendar Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#0E334F] mb-2 flex items-center justify-center gap-3">
              
              Travel Date
              
            </h3>
            {travelDate && (
              <p className="text-[#F7941D] font-semibold text-lg">
                Selected: {dayjs(travelDate).format('MMMM DD, YYYY')}
              </p>
            )}
          </div>

          {/* Calendar Container */}
          <div className="flex justify-center">
            <div className="bg-white/80 rounded-3xl p-6  border border-black">
              <div className="transform scale-110 origin-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={travelDate ? dayjs(travelDate) : null}
                    onChange={handleTravelDateChange}
                    sx={{
                      '& .MuiPickersDay-root': {
                        fontSize: '1rem',
                        fontWeight: '500',
                        '&:hover': {
                          backgroundColor: '#F7941D20',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#F7941D !important',
                          color: 'white',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: '#E47312 !important',
                          },
                        },
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                      },
                      '& .MuiPickersArrowSwitcher-root': {
                        '& .MuiIconButton-root': {
                          color: '#0E334F',
                        },
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#0E334F',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#0E334F',
                        fontWeight: '600',
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="pt-6 border-t border-[#0E334F]/10">
          <div className="text-center space-y-4">
            <Button
              text={"Continue Booking"}
              variant="primary"
              className="group bg-gradient-to-r from-[#F7941D] to-[#E47312] hover:from-[#E47312] hover:to-[#D86511] text-white font-bold px-12 py-4 rounded-2xl  transform hover:scale-105 transition-all duration-300 border-0 min-w-[200px]"
              onClick={handleScrollToForm}
            />
            
            <p className="text-[#0E334F]/60 text-sm">
              Click to proceed with your booking details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}