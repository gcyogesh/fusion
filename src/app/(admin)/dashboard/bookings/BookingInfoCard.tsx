'use client';
import React, { useState } from 'react';
import { fetchAPI } from '@/utils/apiService';
import Alert from '@/components/atoms/alert';
import { FiUser, FiMail, FiPhone, FiCalendar, FiCheckCircle, FiClock, FiEye, FiX, FiChevronDown, FiTrash2 } from 'react-icons/fi';

export interface Booking {
  _id: string;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  tourPackage: string | null;
  bookingDate: string;
  travelDate: string;
  specialRequests: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;p
}

interface BookingInfoCardProps {
  booking: Booking;
  onStatusChange?: (id: string, status: string) => void;
}

const statusOptions = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
];

const statusTextColors: Record<string, string> = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  cancelled: 'text-red-600',
  completed: 'text-green-600',
};

const InfoRow = ({ icon, value, className = '' }: { icon: React.ReactNode; value: string; className?: string }) => (
  <div className={`flex items-center gap-2 min-w-0 ${className}`}>
    {icon}
    <span className="truncate break-words text-gray-800 text-sm" title={value}>{value}</span>
  </div>
);

const BookingInfoCard: React.FC<BookingInfoCardProps> = ({ booking, onStatusChange }) => {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error' | 'warning' | 'confirm'; message: string }>({ show: false, type: 'success', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetchAPI({
        endpoint: `bookings/${booking._id}`,
        method: 'PUT',
        data: { status: newStatus },
      });
      setStatus(newStatus);
      setAlert({ show: true, type: 'success', message: 'Status updated!' });
      onStatusChange?.(booking._id, newStatus);
    } catch (e: any) {
      setAlert({ show: true, type: 'error', message: e.message || 'Failed to update status.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetchAPI({
        endpoint: `bookings/${booking._id}`,
        method: 'DELETE',
      });
      setDeleted(true);
      setAlert({ show: true, type: 'success', message: 'Booking deleted!' });
    } catch (e: any) {
      setAlert({ show: true, type: 'error', message: e.message || 'Failed to delete booking.' });
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (deleted) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-0 mb-2 w-full transition hover:shadow-2xl hover:-translate-y-1 duration-200 flex flex-col overflow-hidden group relative min-w-0">
        {alert.show && (
          <Alert show={alert.show} type={alert.type} message={alert.message} onConfirm={() => setAlert({ ...alert, show: false })} />
        )}
        {/* View Details Icon */}
        <button
          className="absolute top-4 right-12 z-10 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
          onClick={() => setShowModal(true)}
          aria-label="View Details"
        >
          <FiEye className="w-5 h-5" />
        </button>
        {/* Delete Icon */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
          onClick={() => setShowDeleteConfirm(true)}
          aria-label="Delete Booking"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
        <div className="flex h-full min-w-0">
          {/* Colored left border */}
          <div className="w-2 bg-primary group-hover:bg-primary/80 transition-all duration-200" />
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-6 p-6 min-w-0">
            {/* Left: Guest & Booking Info */}
            <div className="flex-1 flex flex-col gap-2 rounded-xl p-4 min-w-0">
              <div className="flex items-center gap-2 text-lg font-bold text-primary min-w-0">
                <FiUser className="w-5 h-5" />
                <span className="truncate" title={booking.guestInfo.name}>{booking.guestInfo.name}</span>
              </div>
              <InfoRow icon={<FiMail className="w-4 h-4" />} value={booking.guestInfo.email} />
              {booking.guestInfo.phone && (
                <InfoRow icon={<FiPhone className="w-4 h-4" />} value={booking.guestInfo.phone} />
              )}
              <InfoRow icon={<FiCalendar className="w-4 h-4" />} value={`Booking: ${new Date(booking.bookingDate).toLocaleDateString()}`} className="text-xs" />
              <InfoRow icon={<FiClock className="w-4 h-4" />} value={`Travel: ${new Date(booking.travelDate).toLocaleDateString()}`} className="text-xs" />
              <div className="text-gray-700 text-sm mt-2 break-words">
                <span className="font-semibold">Special Requests:</span> {booking.specialRequests || <span className="text-gray-400">None</span>}
              </div>
            </div>
            {/* Right: Status & Payment */}
            <div className="flex flex-col gap-3 min-w-[200px] items-start justify-between h-full py-2 min-w-0">
              <div className="flex flex-col gap-1 w-full min-w-0">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <div className="relative w-full min-w-0">
                  <select
                    className={`appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary transition bg-white pr-10 shadow-sm ${statusTextColors[status]}`}
                    value={status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={loading}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt} className={statusTextColors[opt]}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full min-w-0">
                <label className="block text-xs font-semibold text-gray-500">Payment</label>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="flex flex-col w-full mt-2 min-w-0 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="block text-xs font-semibold text-gray-500 mb-1">Total (USD)</span>
                <span className="text-2xl font-extrabold text-primary tracking-tight leading-tight">
                  {booking.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-8 relative flex flex-col gap-4 items-center">
            <FiTrash2 className="w-10 h-10 text-red-500 mb-2" />
            <div className="text-lg font-bold text-gray-800 mb-2 text-center">Delete this booking?</div>
            <div className="text-gray-500 text-center mb-4">This action cannot be undone.</div>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-5 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for more details */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FiUser className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-primary truncate" title={booking.guestInfo.name}>{booking.guestInfo.name}</span>
              </div>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="px-8 py-6 flex flex-col gap-4 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                <InfoRow icon={<FiMail className="w-5 h-5" />} value={booking.guestInfo.email} />
                {booking.guestInfo.phone && (
                  <InfoRow icon={<FiPhone className="w-5 h-5" />} value={booking.guestInfo.phone} />
                )}
                <InfoRow icon={<FiCalendar className="w-5 h-5" />} value={`Booking: ${new Date(booking.bookingDate).toLocaleDateString()}`} />
                <InfoRow icon={<FiClock className="w-5 h-5" />} value={`Travel: ${new Date(booking.travelDate).toLocaleDateString()}`} />
              </div>
              <div className="border-t border-gray-100 my-2" />
              <div className="flex items-center gap-2 text-gray-700 text-base min-w-0">
                <FiCheckCircle className="w-5 h-5 text-green-500" /> Status: <span className={`font-bold ml-1 ${statusTextColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-base min-w-0">
                Payment: <span className={`font-bold ml-1 ${booking.paymentStatus === 'paid' ? 'text-green-700' : 'text-yellow-700'}`}>{booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</span>
              </div>
              <div className="flex flex-col min-w-0 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="block text-xs font-semibold text-gray-500 mb-1">Total (USD)</span>
                <span className="text-2xl font-extrabold text-primary tracking-tight leading-tight">
                  {booking.totalAmount}
                </span>
              </div>
              <div className="border-t border-gray-100 my-2" />
              <div className="text-gray-700 text-base mt-2 break-words min-w-0">
                <span className="font-semibold">Special Requests:</span> {booking.specialRequests || <span className="text-gray-400">None</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingInfoCard; 