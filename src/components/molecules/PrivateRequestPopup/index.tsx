"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchAPI } from "@/utils/apiService";
import { Destination, Activity, TourPackage } from "@/types";

type PrivateRequestPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  tourPackage?: TourPackage; // Add tour package prop
};

const PrivateRequestPopup: React.FC<PrivateRequestPopupProps> = ({ 
  isOpen, 
  onClose, 
  tourPackage 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    preferredDestination: "",
    tripLength: "",
    desiredMonth: "",
    activities: "",
    additionalNotes: "",
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const destData = await fetchAPI<{ success: boolean; data: Destination[] }>({
          endpoint: "destinations",
        });

        const actData = await fetchAPI<{ success: boolean; data: Activity[] }>({
          endpoint: "category/activities",
        });

        if (destData.success && Array.isArray(destData.data)) {
          setDestinations(destData.data);
        } else {
          setDestinations([]);
        }
        if (actData.success && Array.isArray(actData.data)) {
          setActivities(actData.data);
        } else {
          setActivities([]);
        }
      } catch (err) {
        setMessage("Failed to load destinations and activities.");
        setMessageType("error");
      } finally {
        setDataLoading(false);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  // Pre-select destination when tour package is provided
  useEffect(() => {
    if (tourPackage && destinations.length > 0) {
      // Find the destination that matches the tour package's destination
      const matchingDestination = destinations.find(
        dest => dest._id === tourPackage.destination?._id || 
                dest.title === tourPackage.destination?.title
      );
      
      if (matchingDestination) {
        setFormData(prev => ({
          ...prev,
          preferredDestination: matchingDestination.title
        }));
      }
    }
  }, [tourPackage, destinations]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, country, preferredDestination, tripLength, desiredMonth, activities } = formData;

    if (!name || !email || !phone || !country || !preferredDestination || !tripLength || !desiredMonth || !activities) {
      setMessage("⚠️ Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("❌ Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    const phoneRegex = /^[0-9+\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("❌ Please enter a valid phone number.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const payload = {
      guestInfo: {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        country: country.trim(),
      },
      preferredDestination: preferredDestination.trim(),
      tripLength: tripLength.trim(),
      desiredMonth: desiredMonth.trim(),
      activities: activities.trim(),
      additionalNotes: formData.additionalNotes.trim(),
      tourPackageId: tourPackage?._id, // Include tour package ID if available
    };

    try {
      await fetchAPI({
        endpoint: "privatetrip",
        method: "POST",
        data: payload,
      });

      setMessage("🎉 Thank you! Your private trip request has been submitted.");
      setMessageType("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        preferredDestination: "",
        tripLength: "",
        desiredMonth: "",
        activities: "",
        additionalNotes: "",
      });

      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 3000);
    } catch (error: any) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0  bg-opacity-50 z-[9998]" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-[#0E334F] text-white p-6 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Private Trip Request</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Message */}
            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded-md font-medium text-sm ${
                  messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+977 1234567890"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                />
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Your Country"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                />
              </div>

             {/* Preferred Destination */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Preferred Destination *</label>
                <select
                  value={formData.preferredDestination}
                  onChange={(e) => handleChange("preferredDestination", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading || dataLoading}
                >
                  <option value="">Select Destination</option>
                  {destinations.map((d) => (
                    <option key={d._id} value={d.title}>
                      {d.title}
                    </option>
                  ))}
                </select>
                {tourPackage && (
                  <p className="text-xs text-gray-500 mt-1">
                    Pre-selected based on your chosen tour package
                  </p>
                )}
              </div>

              {/* Trip Length */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Trip Length *</label>
                <input
                  type="text"
                  value={formData.tripLength}
                  onChange={(e) => handleChange("tripLength", e.target.value)}
                  placeholder="e.g., 5 days"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                />
              </div>

              {/* Desired Month */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Desired Month *</label>
                <select
                  value={formData.desiredMonth}
                  onChange={(e) => handleChange("desiredMonth", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading}
                >
                  <option value="">Select Month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December",
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Activities */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1 text-gray-700">Activities *</label>
                <select
                  value={formData.activities}
                  onChange={(e) => handleChange("activities", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={loading || dataLoading}
                >
                  <option value="">Select Activity</option>
                  {activities.map((a) => (
                    <option key={a._id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-medium mb-1 text-gray-700">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleChange("additionalNotes", e.target.value)}
                placeholder="Any special requests..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none"
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold py-3 px-4 rounded-md"
                disabled={loading || dataLoading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </> 
  );
};
export default PrivateRequestPopup;