'use client';
import { fetchAPI } from '@/utils/apiService';
import BookingInfoCard, { Booking } from './BookingInfoCard';
import { FiInbox, FiSearch, FiChevronDown, FiEye, FiTrash2, FiX } from 'react-icons/fi';
import Pagination from '@/components/atoms/pagination';
import React, { useState, useEffect } from 'react';
import Alert from '@/components/atoms/alert';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'Name A-Z' },
  { value: 'za', label: 'Name Z-A' },
  { value: 'amountHigh', label: 'Amount High-Low' },
  { value: 'amountLow', label: 'Amount Low-High' },
];

const statusOptions = [
  'pending',
  'cancelled',
  'completed',
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

const paymentColors = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

type AlertType = 'success' | 'error' | 'confirm' | 'warning';
interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [statusLoading, setStatusLoading] = useState('');
  const [deleteLoading, setDeleteLoading] = useState('');
  const [bookingsPerPage, setBookingsPerPage] = useState(5);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, show: false })),
    onCancel: undefined
  });

  useEffect(() => {
    setLoading(true);
    fetchAPI<{ data: Booking[]; total: number }>({
      endpoint: `tour/bookings?page=${currentPage}&limit=${bookingsPerPage}&search=${encodeURIComponent(search)}&sort=${sort}${statusFilter ? `&status=${statusFilter}` : ''}`,
    })
      .then((res) => {
        setBookings(res.data || []);
        setTotalBookings(res.total || 0);
      })
      .catch(() => {
        setBookings([]);
        setTotalBookings(0);
      })
      .finally(() => setLoading(false));
  }, [currentPage, search, sort, statusFilter, bookingsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, statusFilter, bookingsPerPage]);

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  const handleStatusChange = async (booking, newStatus) => {
    setStatusLoading(booking._id);
    try {
      await fetchAPI({
        endpoint: `tour/bookings/${booking._id}`,
        method: 'PUT',
        data: { status: newStatus },
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: newStatus } : b))
      );
      setAlert({
        show: true,
        type: 'success',
        message: 'Status updated successfully!',
        onConfirm: () => setAlert(a => ({ ...a, show: false })),
        onCancel: undefined
      });
    } catch (e) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update status.',
        onConfirm: () => setAlert(a => ({ ...a, show: false })),
        onCancel: undefined
      });
    } finally {
      setStatusLoading('');
    }
  };

  const handleDelete = async (bookingId) => {
    setDeleteLoading(bookingId);
    try {
      await fetchAPI({
        endpoint: `tour/bookings/${bookingId}`,
        method: 'DELETE',
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setDeleteBookingId(null);
      setAlert({
        show: true,
        type: 'success',
        message: 'Booking deleted successfully!',
        onConfirm: () => setAlert(a => ({ ...a, show: false })),
        onCancel: undefined
      });
    } catch (e) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to delete booking.',
        onConfirm: () => setAlert(a => ({ ...a, show: false })),
        onCancel: undefined
      });
    } finally {
      setDeleteLoading('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-stretch w-full">
      <Alert {...alert} />
      <div className="w-full bg-white shadow-sm border-b border-primary py-10 mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow-sm">
          Bookings
        </h1>
        <p className="text-gray-500 text-lg">Manage and review all recent bookings here.</p>
      </div>

      <div className="w-full px-4 md:px-12 lg:px-20 xl:px-32 2xl:px-64">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 w-full">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest, email, or request..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="relative w-48">
            <select
              className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary bg-white pr-8 shadow-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
          </div>

          {/* Bookings Per Page Dropdown */}
          <div className="relative w-40">
            <select
              className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary bg-white pr-8 shadow-sm"
              value={bookingsPerPage}
              onChange={e => setBookingsPerPage(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map(num => (
                <option key={num} value={num}>{num} per page</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
          </div>

          {/* Status Filter */}
          <div className="relative w-48">
            <select
              className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary bg-white pr-8 shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-dashed border-primary w-full">
              <div className="text-2xl font-bold text-primary mb-2">Loading...</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-dashed border-primary w-full">
              <FiSearch className="w-20 h-20 text-primary mb-6" />
              <div className="text-2xl font-bold text-primary mb-2">No Bookings Found</div>
              <div className="text-gray-400 text-base text-center">
                No bookings match your search or filter.
                <br />
                Try adjusting your search or sort options.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {bookings.map((booking, idx) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow border border-primary/20 p-6 flex flex-col gap-2 text-gray-900 relative transition hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="font-bold text-primary flex items-center gap-2 text-base mb-2 md:mb-0">
                      <span>Customer Detail</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[booking.status]}`}
                      >
                        Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${paymentColors[booking.paymentStatus] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">Name:</span> {booking.guestInfo.name}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">Email:</span> {booking.guestInfo.email}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">Phone:</span> {booking.guestInfo.phone}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">Country/Address:</span> {booking.guestInfo.country || '-'}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">No of peoples:</span> {booking.guestInfo.noOfPeoples || '-'}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-primary">Message:</span> {booking.specialRequests || '-'}</div>
                  </div>

                  <div className="mt-2 font-semibold text-primary/80">Package Details</div>

                  <div className="flex gap-3 mt-4">
                    <button
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
                      onClick={() => setViewBooking(booking)}
                    >
                      <FiEye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 border border-red-200 transition"
                      onClick={() => setDeleteBookingId(booking._id)}
                      disabled={deleteLoading === booking._id}
                    >
                      <FiTrash2 className="w-4 h-4" /> Delete
                    </button>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-primary">Change Status:</label>
                      <select
                        className="border border-primary/30 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-primary"
                        value={booking.status}
                        onChange={e => handleStatusChange(booking, e.target.value)}
                        disabled={booking.status !== 'pending' || statusLoading === booking._id}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* View Details Modal */}
                  {viewBooking && viewBooking._id === booking._id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-primary" onClick={() => setViewBooking(null)}><FiX className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold mb-4 text-primary">Booking Details</h2>
                        <div className="space-y-2 text-gray-800">
                          <div><span className="font-semibold">Name:</span> {viewBooking.guestInfo.name}</div>
                          <div><span className="font-semibold">Email:</span> {viewBooking.guestInfo.email}</div>
                          <div><span className="font-semibold">Phone:</span> {viewBooking.guestInfo.phone}</div>
                          <div><span className="font-semibold">Country/Address:</span> {viewBooking.guestInfo.country || '-'}</div>
                          <div><span className="font-semibold">No of peoples:</span> {viewBooking.guestInfo.noOfPeoples || '-'}</div>
                          <div><span className="font-semibold">Message:</span> {viewBooking.specialRequests || '-'}</div>
                          <div><span className="font-semibold">Booking Date:</span> {new Date(viewBooking.bookingDate).toLocaleDateString()}</div>
                          <div><span className="font-semibold">Travel Date:</span> {new Date(viewBooking.travelDate).toLocaleDateString()}</div>
                          <div><span className="font-semibold">Status:</span> {viewBooking.status}</div>
                          <div><span className="font-semibold">Payment Status:</span> {viewBooking.paymentStatus}</div>
                          <div><span className="font-semibold">Total Amount:</span> {viewBooking.totalAmount}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {deleteBookingId === booking._id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full relative flex flex-col items-center">
                        <FiTrash2 className="w-10 h-10 text-red-500 mb-2" />
                        <div className="text-lg font-bold text-gray-800 mb-2 text-center">Delete this booking?</div>
                        <div className="text-gray-500 text-center mb-4">This action cannot be undone.</div>
                        <div className="flex gap-4 w-full justify-center">
                          <button className="px-5 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 shadow transition-colors" onClick={() => setDeleteBookingId(null)}>Cancel</button>
                          <button className="px-5 py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow transition-colors" onClick={() => handleDelete(booking._id)} disabled={deleteLoading === booking._id}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
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
