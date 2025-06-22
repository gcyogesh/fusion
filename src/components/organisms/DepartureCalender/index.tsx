'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUsers, FaUser } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


import 'react-calendar/dist/Calendar.css';
import TextHeader from '@/components/atoms/headings';
import Button from '@/components/atoms/button';

export default function DepartureCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tripType = searchParams.get('trip') || 'group';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="  p-5 space-y-6 bg-white border border-[#0E334F] rounded-xl shadow-md">

         <TextHeader
              text="Trek date and time"
              align="left"
              size="large"
              width={400}
              className=" text-[#1A1E21]"
            />
      

      <div className=" text-[#ffffff]">
        <button
          onClick={() => updateParam('trip', 'group')}
          className={`px-3 py-3   ${
            tripType === 'group' ? 'bg-primary text-[#ffffff]' : 'bg-gray-200'
          }`}
        >
           <div className="flex flex-row items-center text-xl gap-2">
          <FaUsers className='text-2xl'/>
          Group Departures
          </div>
        </button>
        <button
          onClick={() => updateParam('trip', 'private')}
          className={` px-3 py-3   ${
            tripType === 'private' ? 'bg-primary text-[#ffffff]' : 'bg-[#B1B1B1]'
          }`}
        >
          <div className="flex flex-row items-center text-xl gap-2">
         <FaUser className='text-2xl'/> Private Trip
         </div>
        </button>
      </div>

      <h2 className="text-xl text-[#0E334F] font-semibold ">Select Departure Date</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-8">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>
      </div>

       <Button
    text="Book Now"
    variant="primary"
    className=" bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold px-6 py-2 rounded-full text-center"
  />
</div>
    
  );
}
