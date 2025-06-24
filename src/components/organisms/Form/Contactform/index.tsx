"use client";
import React, { useState, FormEvent } from "react";

type ContactFormProps = {
  padding?: number | string;
  width?: "full" | string;
  primaryButton?: string;
  secondaryButton?: string;
  formTitle?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

const ContactForm: React.FC<ContactFormProps> = ({
  padding = 30,
  formTitle,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare the payload matching your backend structure
      const payload = {
        guestInfo: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phone.trim(),
          country: formData.address.trim(),
        },
        message: formData.message.trim(),
      };

      console.log('Sending payload:', payload); // Debug log

      const res = await fetch("https://yogeshbhai.ddns.net/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status); // Debug log

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Server responded with status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('Response data:', data); // Debug log

      // Check if the response indicates success
      if (data.success) {
        setSuccess("🎉 Thank you! Your inquiry has been received and we'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        setError(data.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <div
          className="bg-[#0E334F] w-full max-w-[520px] rounded-3xl shadow-md border border-white flex flex-col gap-6 sm:gap-7 p-6 sm:p-8"
          style={{ padding }}
        >
          {formTitle && (
            <h2 className="text-2xl font-semibold text-white text-center">
              {formTitle}
            </h2>
          )}

          {/* Success & Error Messages */}
          {success && (
  <div className=" rounded-md p-3">
    <p className="text-green-400 text-left font-medium">{success}</p>
  </div>
)}

          {error && (
            <div className=" rounded-md p-1">
              <p className="text-red-400 text-center font-medium">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Name *</label>
            <input
              required
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-transparent border border-white rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">
              Email Address *
            </label>
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-transparent border border-white rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">
              Phone Number *
            </label>
            <input
              required
              type="tel"
              placeholder="+977 1234567890"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-transparent border border-white rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Country */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Country *</label>
            <input
              required
              type="text"
              placeholder="Your Country"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-transparent border border-white rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Message *</label>
            <textarea
              required
              placeholder="Type your message..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full bg-transparent border border-white rounded-md px-4 py-2 h-28 resize-none text-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#F7941D] hover:bg-[#E47312] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-colors duration-300"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;