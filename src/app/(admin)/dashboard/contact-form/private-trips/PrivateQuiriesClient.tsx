"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FiMail, FiPhone, FiUser, FiMapPin, FiMessageCircle, FiClock, FiTrash2, FiCheckCircle, FiXCircle, FiSearch, FiInbox, FiEye, FiX, FiCalendar, FiActivity, FiMap } from "react-icons/fi";
import { fetchAPI } from "@/utils/apiService";
import Pagination from "@/components/atoms/pagination";
import Alert from "@/components/atoms/alert";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAGE_SIZE = 6;

export default function PrivateInquiriesClient({ inquiries: initialInquiries }: { inquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewInquiry, setViewInquiry] = useState<any | null>(null);
  const [alert, setAlert] = useState({ show: false, id: null });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1); // Reset to first page if inquiries change (e.g., after delete)
  }, [inquiries.length, debouncedSearch]);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return inquiries;
    const q = debouncedSearch.trim().toLowerCase();
    return inquiries.filter((inq) => {
      const { guestInfo = {}, preferredDestination = "", activities = "", additionalNotes = "" } = inq;
      return (
        (guestInfo.name && guestInfo.name.toLowerCase().includes(q)) ||
        (guestInfo.email && guestInfo.email.toLowerCase().includes(q)) ||
        (guestInfo.phoneNumber && guestInfo.phoneNumber.toLowerCase().includes(q)) ||
        (guestInfo.country && guestInfo.country.toLowerCase().includes(q)) ||
        (preferredDestination && preferredDestination.toLowerCase().includes(q)) ||
        (activities && activities.toLowerCase().includes(q)) ||
        (additionalNotes && additionalNotes.toLowerCase().includes(q))
      );
    });
  }, [debouncedSearch, inquiries]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete(id: string) {
    setAlert({ show: true, id });
  }
  async function confirmDelete() {
    const id = alert.id;
    setAlert({ show: false, id: null });
    try {
      await fetchAPI({ endpoint: `privatetrip/${id}`, method: "DELETE" });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      setToast({ type: "success", message: "Private trip inquiry deleted successfully!" });
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Failed to delete inquiry." });
    }
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="mb-10 flex items-center max-w-lg mx-auto">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, destination, activities..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white shadow-md transition-all duration-200 focus:shadow-lg"
          />
        </div>
      </div>
      
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <FiCheckCircle className="w-5 h-5" /> : <FiXCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 min-h-[200px]">
        {paginated.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
            <FiInbox className="w-12 h-12 mb-3" />
            <span className="text-lg font-semibold">No private trip inquiries found</span>
          </div>
        ) : paginated.map((inq) => {
          return (
            <div
              key={inq._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col justify-between gap-6 hover:shadow-lg transition-shadow duration-200 relative min-h-[340px] group w-full md:w-[340px] lg:w-[370px] h-[450px]"
              style={{ minHeight: '340px', height: '450px' }}
            >
              {/* Eye icon button for viewing details */}
              <button
                onClick={() => setViewInquiry(inq)}
                className="absolute top-4 right-16 p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 shadow-sm transition"
                title="View Details"
              >
                <FiEye className="w-5 h-5" />
              </button>
              
              {/* Delete button */}
              <button
                onClick={() => handleDelete(inq._id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm transition"
                title="Delete Inquiry"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col flex-grow gap-3 min-h-0">
                <div className="flex items-center gap-4 mb-2">
                  <span className="inline-flex items-center justify-center bg-primary text-white rounded-full p-2">
                    <FiUser className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-semibold text-gray-800">{inq.guestInfo?.name}</span>
                </div>
                
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiMail className="w-4 h-4" />
                    <a
                      href={`mailto:${inq.guestInfo?.email}`}
                      className="text-primary hover:underline"
                      title={`Send email to ${inq.guestInfo?.email}`}
                    >
                      {inq.guestInfo?.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiPhone className="w-4 h-4" />
                    <span>{inq.guestInfo?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiMapPin className="w-4 h-4" />
                    <span>{inq.guestInfo?.country}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiMap className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{inq.preferredDestination}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiCalendar className="w-4 h-4 text-blue-600" />
                    <span>{inq.tripLength} • {inq.desiredMonth}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <FiActivity className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="truncate">{inq.activities}</span>
                  </div>
                </div>
                
                {inq.additionalNotes && (
                  <div className="flex items-start gap-2 text-gray-700 text-sm mt-2 flex-1 min-h-0">
                    <FiMessageCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    <span
                      className="whitespace-pre-line break-words"
                      style={{
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '1.5em',
                        fontSize: '0.875rem',
                        color: '#374151',
                      }}
                    >
                      {(() => {
                        const words = inq.additionalNotes.split(/\s+/);
                        return words.length > 15
                          ? words.slice(0, 15).join(' ') + '...'
                          : inq.additionalNotes;
                      })()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-400 text-xs mt-4 pt-3 border-t border-gray-100">
                <FiClock className="w-4 h-4" />
                <span>Received: {formatDate(inq.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            getPageUrl={() => "#"}
            onPageChange={setPage}
          />
        </div>
      )}
      
      {/* Modal for viewing inquiry details */}
      {viewInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setViewInquiry(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              title="Close"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
              <FiUser className="w-6 h-6" /> {viewInquiry.guestInfo?.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <FiMail className="w-5 h-5" />
                <span>{viewInquiry.guestInfo?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiPhone className="w-5 h-5" />
                <span>{viewInquiry.guestInfo?.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiMapPin className="w-5 h-5" />
                <span>{viewInquiry.guestInfo?.country}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiClock className="w-5 h-5" />
                <span>{formatDate(viewInquiry.createdAt)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <FiMap className="w-5 h-5 text-green-600" />
                <div>
                  <span className="text-sm text-gray-500">Destination:</span>
                  <div className="font-medium">{viewInquiry.preferredDestination}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiCalendar className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm text-gray-500">Trip Duration:</span>
                  <div className="font-medium">{viewInquiry.tripLength}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiCalendar className="w-5 h-5 text-orange-600" />
                <div>
                  <span className="text-sm text-gray-500">Desired Month:</span>
                  <div className="font-medium">{viewInquiry.desiredMonth}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <FiActivity className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <span className="text-sm text-gray-500">Activities:</span>
                  <div className="font-medium">{viewInquiry.activities}</div>
                </div>
              </div>
            </div>
            
            {viewInquiry.additionalNotes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
                  <FiMessageCircle className="w-5 h-5 text-primary" /> Additional Notes
                </h3>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-gray-800 whitespace-pre-line break-words">
                  {viewInquiry.additionalNotes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Render the Alert for delete confirmation */}
      <Alert
        show={alert.show}
        type="confirm"
        message="Are you sure you want to delete this private trip inquiry?"
        onConfirm={confirmDelete}
        onCancel={() => setAlert({ show: false, id: null })}
      />
    </div>
  );
}