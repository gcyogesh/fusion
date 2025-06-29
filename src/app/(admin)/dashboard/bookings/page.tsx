'use client';
import { fetchAPI } from '@/utils/apiService';
import BookingInfoCard, { Booking } from './BookingInfoCard';
import { FiInbox, FiSearch, FiChevronDown } from 'react-icons/fi';
import Pagination from '@/components/atoms/pagination';
import React, { useState, useMemo } from 'react';

export const dynamic = 'force-dynamic'; // for SSR

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'Name A-Z' },
  { value: 'za', label: 'Name Z-A' },
  { value: 'amountHigh', label: 'Amount High-Low' },
  { value: 'amountLow', label: 'Amount Low-High' },
];

export default async function BookingsPage() {
  let bookings: Booking[] = [];
  try {
    const res = await fetchAPI<{ data: Booking[] }>({ endpoint: 'tour/bookings' });
    bookings = res.data || [];
  } catch {
    bookings = [];
  }

  // Client-side state for search, sort, and pagination
  // Use a Client Component for interactivity
  return <BookingsClient bookings={bookings} />;
}

function BookingsClient({ bookings }: { bookings: Booking[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const bookingsPerPage = 9;

  const filteredSortedBookings = useMemo(() => {
    let filtered = bookings.filter((b) => {
      const q = search.toLowerCase();
      return (
        b.guestInfo.name.toLowerCase().includes(q) ||
        b.guestInfo.email.toLowerCase().includes(q) ||
        (b.specialRequests && b.specialRequests.toLowerCase().includes(q))
      );
    });
    switch (sort) {
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'az':
        filtered = filtered.sort((a, b) => a.guestInfo.name.localeCompare(b.guestInfo.name));
        break;
      case 'za':
        filtered = filtered.sort((a, b) => b.guestInfo.name.localeCompare(a.guestInfo.name));
        break;
      case 'amountHigh':
        filtered = filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'amountLow':
        filtered = filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return filtered;
  }, [bookings, search, sort]);

  const totalPages = Math.ceil(filteredSortedBookings.length / bookingsPerPage);
  const paginatedBookings = filteredSortedBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  return (
    <div className="min-h-screen flex flex-col items-stretch w-full">
      <div className="w-full bg-white shadow-sm border-b border-primary py-10 mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-sm">Bookings</h1>
        <p className="text-gray-500 text-lg">Manage and review all recent bookings here.</p>
      </div>
      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-32 2xl:px-64">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 w-full">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest, email, or request..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative w-48">
            <select
              className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary transition bg-white pr-8 shadow-sm"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBookings.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-dashed border-primary w-full">
              <FiSearch className="w-20 h-20 text-primary mb-6" />
              <div className="text-2xl font-bold text-primary mb-2">No Bookings Found</div>
              <div className="text-gray-400 text-base text-center">
                No bookings match your search or filter.<br />
                Try adjusting your search or sort options.
              </div>
            </div>
          ) : (
            paginatedBookings.map((booking) => (
              <BookingInfoCard key={booking._id} booking={booking} />
            ))
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            getPageUrl={() => '#'}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
} 