
"use client"
import React, { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/apiService";
import { FaStar, FaTrash, FaQuoteLeft, FaEye } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Alert from "@/components/atoms/alert";

const truncate = (str, n) => (str.length > n ? str.slice(0, n) + '...' : str);

const ReviewCard = ({ review, onDelete, deleting, onView }) => (
  <div className="relative flex flex-col items-center w-full max-w-md mx-auto rounded-2xl border border-gray-200 shadow-lg p-8 bg-white hover:shadow-2xl transition group">
    {/* Action Buttons */}
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        className={`text-blue-500 hover:text-blue-700 p-2 rounded-full bg-white shadow transition`}
        title="View full review"
        onClick={() => onView(review)}
      >
        <FaEye size={18} />
      </button>
      <button
        className={`text-red-500 hover:text-red-700 p-2 rounded-full bg-white shadow transition ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
        title="Delete review"
        onClick={() => onDelete(review)}
        disabled={deleting}
      >
        <FaTrash size={18} />
      </button>
    </div>
    {/* Avatar */}
    <div className="mb-3">
      <span className="inline-block rounded-full ring-4 ring-primary/30">
        <img src="/images/Avtar.png" alt="avatar" className="w-16 h-16 rounded-full object-cover" />
      </span>
    </div>
    {/* Name and Email */}
    <div className="flex flex-col items-center mb-2">
      <span className="font-bold text-lg text-gray-900">{review.guestInfo?.name || 'Anonymous'}</span>
      {review.guestInfo?.email && (
        <span className="mt-1 px-3 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{review.guestInfo.email}</span>
      )}
    </div>
    {/* Stars */}
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: review.rating }).map((_, i) => (
        <FaStar key={i} className="text-yellow-400 text-xl drop-shadow" />
      ))}
    </div>
    {/* Comment */}
    <blockquote className="relative text-gray-700 text-base italic px-4 py-3 border-l-4 border-primary bg-gray-50 rounded w-full">
      <FaQuoteLeft className="absolute -left-3 -top-2 text-primary/30 text-lg" />
      {truncate(review.comment, 120)}
      {review.comment.length > 120 && (
        <span className="ml-2 text-blue-500 text-xs font-semibold">See All</span>
      )}
    </blockquote>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24">
    <FaStar className="text-6xl text-gray-300 mb-4" />
    <div className="text-xl font-semibold text-gray-500 mb-2">No reviews available</div>
    <div className="text-gray-400">Once you receive reviews, they'll appear here for management.</div>
  </div>
);

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null); // for modal
  const [alert, setAlert] = useState({ show: false, review: null });

  useEffect(() => {
    fetchAPI({ endpoint: 'reviews' })
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (review) => {
    setAlert({ show: true, review });
  };

  const confirmDelete = async () => {
    const review = alert.review;
    setDeletingId(review._id);
    setAlert({ show: false, review: null });
    setError("");
    try {
      await fetchAPI({ endpoint: `reviews/${review._id}`, method: 'DELETE' });
      setReviews(reviews => reviews.filter(r => r._id !== review._id));
    } catch (e: any) {
      setError(e.message || 'Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (review) => {
    setViewing(review);
  };
  const closeModal = () => setViewing(null);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl px-4 ">
        <div className="flex items-center gap-3 mb-8">
          <FaStar className="text-3xl text-yellow-400" />
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <ImSpinner2 className="animate-spin text-gray-400 text-3xl" />
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDelete}
                deleting={deletingId === review._id}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
      {/* Modal for viewing full review */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            <div className="flex flex-col items-center mb-4">
              <span className="inline-block rounded-full ring-4 ring-primary/30 mb-2">
                <img src="/images/Avtar.png" alt="avatar" className="w-20 h-20 rounded-full object-cover" />
              </span>
              <span className="font-bold text-xl text-gray-900">{viewing.guestInfo?.name || 'Anonymous'}</span>
              {viewing.guestInfo?.email && (
                <span className="mt-1 px-3 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{viewing.guestInfo.email}</span>
              )}
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: viewing.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl drop-shadow" />
                ))}
              </div>
            </div>
            <blockquote className="relative text-gray-700 text-base italic px-4 py-3 border-l-4 border-primary bg-gray-50 rounded w-full">
              <FaQuoteLeft className="absolute -left-3 -top-2 text-primary/30 text-lg" />
              {viewing.comment}
            </blockquote>
          </div>
        </div>
      )}
      {/* Custom Alert for delete confirmation */}
      <Alert
        show={alert.show}
        type="confirm"
        message={alert.review ? `Are you sure you want to delete this review by ${alert.review.guestInfo?.name || 'Anonymous'}?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setAlert({ show: false, review: null })}
      />
    </div>
  );
};

export default ReviewsPage; 