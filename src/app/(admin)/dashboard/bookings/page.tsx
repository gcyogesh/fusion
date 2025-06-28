import { fetchAPI } from '@/utils/apiService';
import BookingInfoCard, { Booking } from './BookingInfoCard';
import { FiInbox } from 'react-icons/fi';
import BookingsGridWithPagination from './BookingsGridWithPagination';

export const dynamic = 'force-dynamic'; // for SSR

export default async function BookingsPage() {
  let bookings: Booking[] = [];
  try {
    const res = await fetchAPI<{ data: Booking[] }>({ endpoint: 'tour/bookings' });
    bookings = res.data || [];
  } catch {
    bookings = [];
  }

  return (
    <div className="min-h-screen  flex flex-col items-stretch w-full">
      <div className="w-full bg-white shadow-sm border-b border-primary py-10 mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-sm">Bookings</h1>
        <p className="text-gray-500 text-lg">Manage and review all recent bookings here.</p>
      </div>
      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-32 2xl:px-64">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-dashed border-primary w-full">
            <FiInbox className="w-20 h-20 text-primary mb-6" />
            <div className="text-2xl font-bold text-primary mb-2">No Bookings Found</div>
            <div className="text-gray-400 text-base text-center">
              You have not received any bookings yet.<br />
              Once a booking is made, it will appear here.
            </div>
          </div>
        ) : (
          <BookingsGridWithPagination bookings={bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        )}
      </div>
    </div>
  );
} 