"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Alert from "@/components/atoms/alert";
import { fetchAPI } from "@/utils/apiService";

type PrivateRequestPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Destination = {
  _id: string;
  title: string;
  subtitle: string;
  slug: string;
};

type Activity = {
  _id: string;
  name: string;
  image: string;
  slug: string;
};

const PrivateRequestPopup: React.FC<PrivateRequestPopupProps> = ({ isOpen, onClose }) => {
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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const destData = await fetchAPI<{ success: boolean; data: Destination[] }>({ endpoint: "destinations" });
        const actData = await fetchAPI<{ success: boolean; data: Activity[] }>({ endpoint: "category/activities" });

        if (destData.success) setDestinations(destData.data);
        if (actData.success) setActivities(actData.data);
      } catch (err) {
        showAlert("error", "Failed to load destinations and activities.");
      } finally {
        setDataLoading(false);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.name || !formData.email || !formData.phone || !formData.country ||
      !formData.preferredDestination || !formData.tripLength ||
      !formData.desiredMonth || !formData.activities
    ) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      guestInfo: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        country: formData.country.trim(),
      },
      preferredDestination: formData.preferredDestination.trim(),
      tripLength: formData.tripLength.trim(),
      desiredMonth: formData.desiredMonth.trim(),
      activities: formData.activities.trim(),
      additionalNotes: formData.additionalNotes.trim(),
    };

    try {
      const response = await fetchAPI({
        endpoint: "privatetrip",
        method: "POST",
        data: payload,
      });

      showAlert("success", "🎉 Thank you! Your private trip request has been received.");

      setFormData({
        name: "", email: "", phone: "", country: "",
        preferredDestination: "", tripLength: "", desiredMonth: "",
        activities: "", additionalNotes: "",
      });

      setTimeout(() => {
        setAlertVisible(false);
        onClose();
      }, 3000);
    } catch (error: any) {
      showAlert("error", error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Alert
        show={alertVisible}
        type={alertType}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[100vh] overflow-y-auto">
          <div className="bg-[#0E334F] text-white p-6 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Private Trip Request</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["name", "Name", "Your Name", "text"],
                ["email", "Email Address", "your@email.com", "email"],
                ["phone", "Phone Number", "+977 1234567890", "tel"],
                ["country", "Country", "Your Country", "text"],
                ["tripLength", "Trip Length", "e.g., 5 days", "text"],
              ].map(([key, label, placeholder, type]) => (
                <div className="flex flex-col" key={key}>
                  <label className="text-sm font-medium mb-1 text-gray-700">{label} *</label>
                  <input
                    type={type}
                    value={(formData as any)[key]}
                    onChange={(e) => handleChange(key as string, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    disabled={loading}
                  />
                </div>
              ))}

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
                    <option key={d._id} value={d.title}>{d.title}</option>
                  ))}
                </select>
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
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>{month}</option>
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
                    <option key={a._id} value={a.name}>{a.name}</option>
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

            {/* ✅ Test Alert Button (remove later) */}
            <div className="mt-4 text-center">
              <button
                className="text-sm text-blue-600 underline"
                onClick={() => showAlert("success", "This is a test alert.")}
              >
                Show Test Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateRequestPopup;
