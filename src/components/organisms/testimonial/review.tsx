'use client';
import React, { useState, useEffect } from 'react';
import { fetchAPI } from '@/utils/apiService';
import TestimonialList from '@/components/organisms/testimonial/testimonialList';
import Input from '@/components/atoms/input/input';
import TextArea from '@/components/atoms/input/textArea';
import Button from '@/components/atoms/button';
import { FaStar } from 'react-icons/fa';
import TextHeader from '@/components/atoms/headings';


function ReviewSection({ tourId }: { tourId: string }) {
  const [reviews, setReviews] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI({ endpoint: `reviews?tour=${tourId}` });

    setReviews(res?.data)
    } catch (e) {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const reviewPayload = {
        tour: tourId,
        guestInfo: { name: form.name, email: form.email },
        rating: Number(form.rating),
        comment: form.comment,
        status: 'pending',
      };
      await fetchAPI({ endpoint: 'reviews', method: 'POST', data: reviewPayload });
      setSuccess('Review submitted! It will appear after approval.');
      setForm({ name: '', email: '', rating: 5, comment: '' });
      fetchReviews();
    } catch (e: any) {
      setError(e.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  return (
    <div>
    <div className="max-w-xl max-h-full bg-white rounded-2xl shadow-xl overflow-hidden  p-4">
      <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={form.name}
          onChange={(val) => setForm((prev) => ({ ...prev, name: val }))}
          prefix={null}
          options={[]}
          validate={undefined}
          errorMessage={''}
          phone={false}
          isError={false}
          
        />
        <Input
          label="Your Email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(val) => setForm((prev) => ({ ...prev, email: val }))}
          type="email"
          prefix={null}
          options={[]}
          validate={undefined}
          errorMessage={''}
          phone={false}
          isError={false}
        />
        <div>
          <label className="text-base font-semibold  tracking-widest mb-2 block">
            Rating<span className="text-red-500"> *</span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <FaStar className={star <= form.rating ? 'text-yellow-500' : 'text-gray-300'} size={24} />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{form.rating} / 5</span>
          </div>
        </div>
        <TextArea
          label="Your Review"
          placeholder="Write your review here..."
          value={form.comment}
          onChange={(val: any) => setForm((prev) => ({ ...prev, comment: val }))}
          errorMessage={''}
          isError={false}
        />
        <Button
          text={submitting ? 'Submitting...' : 'Submit Review'}
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
      </div>
      <section>
      <TextHeader text="Reviews" size="large" align="left" className="py-2" />
     
      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No reviews available.</div>
      ) : (
        
        <TestimonialList
          testimonialData={reviews.map((r: any) => ({
            message: r.comment,
            name: r.guestInfo?.name || 'Anonymous',
            position: '',
            profileImage: '/images/Avtar.png',
            rating: r.rating,
          }))}
        />
      
      )}
      </section>
    </div>
  );
}

export default ReviewSection;
