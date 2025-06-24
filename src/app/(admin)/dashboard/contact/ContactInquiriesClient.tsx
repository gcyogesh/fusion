"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FiMail, FiPhone, FiUser, FiMapPin, FiMessageCircle, FiClock, FiTrash2, FiCheckCircle, FiXCircle, FiSearch, FiInbox } from "react-icons/fi";
import { fetchAPI } from "@/utils/apiService";
import Pagination from "@/components/atoms/pagination";

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
const MAX_PREVIEW_CHARS = 200;

export default function ContactInquiriesClient({ inquiries: initialInquiries }: { inquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
      const { guestInfo = {}, message = "" } = inq;
      return (
        (guestInfo.name && guestInfo.name.toLowerCase().includes(q)) ||
        (guestInfo.email && guestInfo.email.toLowerCase().includes(q)) ||
        (guestInfo.phoneNumber && guestInfo.phoneNumber.toLowerCase().includes(q)) ||
        (guestInfo.country && guestInfo.country.toLowerCase().includes(q)) ||
        (message && message.toLowerCase().includes(q))
      );
    });
  }, [debouncedSearch, inquiries]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const anyLongCollapsed = paginated.some(inq => inq.message && inq.message.length > MAX_PREVIEW_CHARS && !expanded[inq._id]);
  const allLongExpanded = paginated.every(inq => !(inq.message && inq.message.length > MAX_PREVIEW_CHARS) || expanded[inq._id]);
  const handleExpandAll = () => {
    const newExpanded = { ...expanded };
    paginated.forEach(inq => {
      if (inq.message && inq.message.length > MAX_PREVIEW_CHARS) {
        newExpanded[inq._id] = true;
      }
    });
    setExpanded(newExpanded);
  };
  const handleCollapseAll = () => {
    const newExpanded = { ...expanded };
    paginated.forEach(inq => {
      if (inq.message && inq.message.length > MAX_PREVIEW_CHARS) {
        newExpanded[inq._id] = false;
      }
    });
    setExpanded(newExpanded);
  };

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await fetchAPI({ endpoint: `contact/${id}`, method: "DELETE" });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      setToast({ type: "success", message: "Inquiry deleted successfully!" });
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Failed to delete inquiry." });
    }
    setTimeout(() => setToast(null), 2500);
  }

  const handleToggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
            placeholder="Search by name, email, phone, country, or message..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white shadow-md transition-all duration-200 focus:shadow-lg"
          />
        </div>
      </div>
      {/* See more/less all button */}
      {paginated.some(inq => inq.message && inq.message.length > MAX_PREVIEW_CHARS) && (
        <div className="flex justify-end max-w-6xl mx-auto mb-4 px-2">
          <button
            className="text-primary text-sm font-semibold px-4 py-2 rounded hover:underline transition-all duration-150 border border-primary bg-white shadow-sm"
            onClick={allLongExpanded ? handleCollapseAll : handleExpandAll}
          >
            {allLongExpanded ? 'See less' : 'See more'}
          </button>
        </div>
      )}
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
            <span className="text-lg font-semibold">No contacts found</span>
          </div>
        ) : paginated.map((inq) => {
          const isLong = inq.message && inq.message.length > MAX_PREVIEW_CHARS;
          const isExpanded = expanded[inq._id];
          const preview = isLong && !isExpanded ? inq.message.slice(0, MAX_PREVIEW_CHARS) : inq.message;
          const isUnread = inq.status === 'open';
          return (
            <div
              key={inq._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col justify-between gap-6 hover:shadow-lg transition-shadow duration-200 relative min-h-[340px] group w-full md:w-[340px] lg:w-[370px] h-[400px]"
              style={{ minHeight: '340px', height: '400px' }}
            >
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
                <div className="flex items-start gap-3 text-gray-700 text-base mt-4 flex-1 min-h-0">
                  <FiMessageCircle className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                  <span
                    className={
                      `font-medium whitespace-pre-line break-words w-full border border-gray-200 rounded-xl px-4 py-3 text-[1rem] leading-relaxed relative block bg-white overflow-y-auto transition-all duration-200` +
                      (isLong && !isExpanded ? ' max-h-[7em] fade-out-mask' : '')
                    }
                    style={{ wordBreak: 'break-word', minHeight: '3.5em', maxHeight: isExpanded ? 'none' : isLong ? '7em' : undefined }}
                  >
                    {preview}
                  </span>
                </div>
                {/* Only show See more/less button if message is long */}
                {isLong && (
                  <button
                    className="self-end mt-2 text-xs sm:text-sm text-primary hover:underline font-semibold px-2 py-1 rounded transition-all duration-150"
                    onClick={() => handleToggleExpand(inq._id)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
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
    </div>
  );
}
