"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";
import { loadStripe } from '@stripe/stripe-js';
import { fetchAPI } from '@/utils/apiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TourPackage {
  _id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
  basePrice: number;
  currency: string;
  gallery: string[];
  duration: {
    days: number;
    nights: number;
  };
}

interface UserFormProps {
  availableBookingDates: string[];
  availableTravelDates: string[];
}

const UserForm: React.FC<UserFormProps> = ({ availableBookingDates = [], availableTravelDates = [] }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tourPackageId, setTourPackageId] = useState<string | null>(null);
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bookingDate: "",
    date: "",
    name: "",
    email: "",
    phone: "",
    travellers: "",
    country: "",
    message: "",
    agree: false,
  });

  const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);
  const [showTravelDatePicker, setShowTravelDatePicker] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

  // Extract tour package ID from URL
  useEffect(() => {
    if (params?.id) {
      setTourPackageId(params.id as string);
    }
  }, [params]);

  // Fetch tour package details
  useEffect(() => {
    const fetchTourPackage = async () => {
      if (!tourPackageId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://yogeshbhai.ddns.net/api/tour/packages/${tourPackageId}`
        );
        if (response.ok) {
          const result = await response.json();
          setTourPackage(result.data);
        } else {
          console.error("Failed to fetch tour package");
        }
      } catch (error) {
        console.error("Error fetching tour package:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourPackage();
  }, [tourPackageId]);

  // Sync formData.date and formData.bookingDate with URL params
  useEffect(() => {
    const urlDate = searchParams.get('date') || searchParams.get('travelDate');
    const urlBookingDate = searchParams.get('bookingDate');
    if (urlDate && urlDate !== formData.date) {
      setFormData((prev) => ({ ...prev, date: urlDate }));
    }
    if (urlBookingDate && urlBookingDate !== formData.bookingDate) {
      setFormData((prev) => ({ ...prev, bookingDate: urlBookingDate }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handlePayNow = async () => {
    setPayLoading(true);
    setPayError(null);
    try {
      const bookingId = tourPackageId;
      const data = await fetchAPI({
        endpoint: 'payments/create-checkout-session',
        method: 'POST',
        data: {
          bookingId,
          successUrl: `${BASE_URL}/payment-success?bookingId=${bookingId}`,
          cancelUrl: `${BASE_URL}/payment-cancel`,
        },
      });
      // Type guard for API response
      const resp = data as { success?: boolean; data?: { sessionId?: string }; message?: string };
      if (resp.success && resp.data?.sessionId) {
        const stripe = await loadStripe('pk_test_...'); // <-- Replace with your Stripe public key
        await stripe.redirectToCheckout({ sessionId: resp.data.sessionId });
      } else {
        setPayError(resp.message || 'Failed to create session');
      }
    } catch (err: any) {
      setPayError(err.message || 'Payment error');
    } finally {
      setPayLoading(false);
    }
  };

  // Helper to get dropdown options including custom date from searchParams
  const getBookingDateOptions = () => {
    const options = [...availableBookingDates];
    if (formData.bookingDate && !options.includes(formData.bookingDate)) {
      options.push(formData.bookingDate);
    }
    return options;
  };
  const getTravelDateOptions = () => {
    const options = [...availableTravelDates];
    if (formData.date && !options.includes(formData.date)) {
      options.push(formData.date);
    }
    return options;
  };

  return (
    <div className="max-w-6xl mx-auto ">
      {/* Loading Spinner */}
      {loading && (
        <div className="mb-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7941D]"></div>
          <p className="mt-2 text-gray-600">Loading tour package details...</p>
        </div>
      )}

      {/* Tour Package Details */}
      {tourPackage && (
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-[#0E334F] overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={tourPackage.gallery[0]}
              alt={tourPackage.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{tourPackage.title}</h2>
                <p className="text-lg">
                  📍 {tourPackage.location.city}, {tourPackage.location.country}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F7941D]">
                  {tourPackage.currency.toUpperCase()} {tourPackage.basePrice}
                </div>
                <div className="text-sm text-gray-600">Base Price</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#0E334F]">
                  {tourPackage.duration.days}D/{tourPackage.duration.nights}N
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {tourPackage.gallery.length}
                </div>
                <div className="text-sm text-gray-600">Gallery Images</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Available</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Package Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {tourPackage.gallery.slice(0, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${tourPackage.title} ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-[#F7941D] transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {tourPackage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Checkout Popup (no dark overlay) */}
      {showModal && (
        <div className="fixed left-1/2 top-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-2xl p-0 relative border border-gray-200 flex flex-col md:flex-row overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* LEFT: Package Details */}
            <div className="w-full md:w-[350px] bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
              {tourPackage && (
                <>
                  <img
                    src={tourPackage.gallery[0]}
                    alt={tourPackage.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className="font-bold text-lg mb-1 text-center">{tourPackage.title}</div>
                  <div className="text-gray-600 mb-1 text-center">{tourPackage.location.city}, {tourPackage.location.country}</div>
                  <div className="mb-1 text-center">Base Price: <span className="font-semibold text-[#F7941D]">{tourPackage.currency.toUpperCase()} {tourPackage.basePrice}</span></div>
                  <div className="mb-1 text-center">Duration: <span className="font-semibold text-[#0E334F]">{tourPackage.duration.days}D/{tourPackage.duration.nights}N</span></div>
                  <div className="mb-2 text-center text-gray-700 text-sm">{tourPackage.description}</div>
                </>
              )}
            </div>
            {/* RIGHT: Booking Details */}
            <div className="flex-1 p-8 flex flex-col justify-center min-w-[250px]">
              <h2 className="text-xl font-bold mb-4 text-[#0E334F]">Booking Details</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-1">Booking Date</label>
                  <select
                    required
                    value={formData.bookingDate}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setShowBookingDatePicker(true);
                      } else {
                        setShowBookingDatePicker(false);
                        handleChange('bookingDate', e.target.value);
                      }
                    }}
                    className="border border-gray-300 p-2 rounded w-full bg-white text-gray-700 h-[44px]"
                  >
                    <option value="">Select Booking Date</option>
                    {getBookingDateOptions().map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                    <option value="__custom__">Pick a custom date...</option>
                  </select>
                  {showBookingDatePicker && (
                    <div className="absolute z-50 bg-white p-2 rounded shadow border mt-2">
                      <DatePicker
                        selected={formData.bookingDate ? new Date(formData.bookingDate) : null}
                        onChange={date => {
                          setShowBookingDatePicker(false);
                          handleChange('bookingDate', date ? date.toISOString().split('T')[0] : '');
                        }}
                        inline
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-1">Travel Date</label>
                  <select
                    required
                    value={formData.date}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setShowTravelDatePicker(true);
                      } else {
                        setShowTravelDatePicker(false);
                        handleChange('date', e.target.value);
                      }
                    }}
                    className="border border-gray-300 p-2 rounded w-full bg-white text-gray-700 h-[44px]"
                  >
                    <option value="">Select Travel Date</option>
                    {getTravelDateOptions().map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                    <option value="__custom__">Pick a custom date...</option>
                  </select>
                  {showTravelDatePicker && (
                    <div className="absolute z-50 bg-white p-2 rounded shadow border mt-2">
                      <DatePicker
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={date => {
                          setShowTravelDatePicker(false);
                          handleChange('date', date ? date.toISOString().split('T')[0] : '');
                        }}
                        inline
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-2"><span className="font-semibold">Name:</span> {formData.name}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {formData.email}</div>
              <div className="mb-2"><span className="font-semibold">Phone:</span> {formData.phone}</div>
              <div className="mb-2"><span className="font-semibold">No. of Travellers Booked:</span> {formData.travellers}</div>
              <div className="mb-2"><span className="font-semibold">Country:</span> {formData.country}</div>
              <div className="mb-2"><span className="font-semibold">Message:</span> {formData.message}</div>
              <button
                className="w-full bg-[#F7941D] hover:bg-[#E47312] text-white font-bold py-3 rounded-full text-lg mt-6 shadow-md disabled:opacity-60"
                onClick={handlePayNow}
                disabled={payLoading}
              >
                {payLoading ? "Redirecting..." : "Pay Now"}
              </button>
              {payError && <div className="text-red-600 text-sm mt-2 text-center">{payError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-[#0E334F] p-6"
      >
        <TextDescription
          text="Looking for personalized experience? We organize privately guided journey which is mainly designed to fit your taste and interest. Please fill out the form below to get started."
          className="w-full max-w-[850px] mb-10 text-left"
        />

        {/* Booking Date and Travel Date side by side */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">Booking Date</label>
            <select
              required
              value={formData.bookingDate}
              onChange={e => {
                if (e.target.value === '__custom__') {
                  setShowBookingDatePicker(true);
                } else {
                  setShowBookingDatePicker(false);
                  handleChange('bookingDate', e.target.value);
                }
              }}
              className="border border-gray-300 p-2 rounded w-full bg-white text-gray-700 h-[44px]"
            >
              <option value="">Select Booking Date</option>
              {getBookingDateOptions().map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
              <option value="__custom__">Pick a custom date...</option>
            </select>
            {showBookingDatePicker && (
              <div className="absolute z-50 bg-white p-2 rounded shadow border mt-2">
                <DatePicker
                  selected={formData.bookingDate ? new Date(formData.bookingDate) : null}
                  onChange={date => {
                    setShowBookingDatePicker(false);
                    handleChange('bookingDate', date ? date.toISOString().split('T')[0] : '');
                  }}
                  inline
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">Travel Date</label>
            <select
              required
              value={formData.date}
              onChange={e => {
                if (e.target.value === '__custom__') {
                  setShowTravelDatePicker(true);
                } else {
                  setShowTravelDatePicker(false);
                  handleChange('date', e.target.value);
                }
              }}
              className="border border-gray-300 p-2 rounded w-full bg-white text-gray-700 h-[44px]"
            >
              <option value="">Select Travel Date</option>
              {getTravelDateOptions().map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
              <option value="__custom__">Pick a custom date...</option>
            </select>
            {showTravelDatePicker && (
              <div className="absolute z-50 bg-white p-2 rounded shadow border mt-2">
                <DatePicker
                  selected={formData.date ? new Date(formData.date) : null}
                  onChange={date => {
                    setShowTravelDatePicker(false);
                    handleChange('date', date ? date.toISOString().split('T')[0] : '');
                  }}
                  inline
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            required
            type="text"
            placeholder="Traveler's Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            required
            type="email"
            placeholder="Type Your Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />

          <input
            required
            type="tel"
            placeholder="Type your Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <select
            required
            value={formData.travellers}
            onChange={(e) => handleChange("travellers", e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">No. of Travellers</option>
            <option value="1">1</option>
            <option value="2-4">2-4</option>
            <option value="5+">5+</option>
          </select>

          <select
            required
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="">Country</option>
            <option value="Nepal">Nepal</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
          </select>
        </div>

        <textarea
          placeholder="Place your Comments Here"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="border border-gray-300 p-2 rounded w-full h-[185px] mb-4 resize-none"
        />

        <div className="flex items-start mb-6">
          <input
            id="terms"
            type="checkbox"
            checked={formData.agree}
            onChange={(e) => handleChange("agree", e.target.checked)}
            className="mr-2 mt-1"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to Fusion Expeditions Terms and Conditions
          </label>
        </div>

        <Button
          type="submit"
          text="Submit"
          variant="primary"
          className="w-full bg-[#F7941D] hover:bg-[#E47312] text-white font-bold py-3 rounded-full text-lg mt-6 shadow-md disabled:opacity-60"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default UserForm;