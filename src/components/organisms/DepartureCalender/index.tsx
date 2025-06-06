'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TextHeader from '@/components/atoms/headings';
import Button from '@/components/atoms/button';

export default function DepartureCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tripType = searchParams.get('trip') || 'group';
  const selectedDate = searchParams.get('date')
    ? new Date(searchParams.get('date') as string)
    : new Date();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl  p-6 bg-white rounded-xl shadow-md">

         <TextHeader
              text="ABC Trek date and time"
              align="left"
              size="large"
              width={400}
              className="mb-2 text-[#1A1E21]"
            />
      

      <div className="flex  mb-6">
        <button
          onClick={() => updateParam('trip', 'group')}
          className={` px-2 py-2 rounded ${
            tripType === 'group' ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
        >
          👥 Group Departures
        </button>
        <button
          onClick={() => updateParam('trip', 'private')}
          className={` px-2 py-2 rounded ${
            tripType === 'private' ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
        >
          👤 Private Trip
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-4">Select Departure Date</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar
          value={selectedDate}
          onChange={(date: Date) => updateParam('date', date.toISOString())}
        />
        <Calendar
          value={selectedDate}
          onChange={(date: Date) => updateParam('date', date.toISOString())}
        />
      </div>

      <div className="mt-6">
        <div>
        <Button
          text="Submit"
          variant="primary"
          className="bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold py-2 px-6 rounded-full"
        />
      </div>
      </div>
    </div>
  );
}
