"use client";
import Button from "@/components/atoms/button";
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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

          {/* Name */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Name</label>
            <input
              required
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Phone Number</label>
            <input
              required
              type="tel"
              placeholder="+977"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Address</label>
            <input
              required
              type="text"
              placeholder="Your Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col w-full">
            <label className="text-sm text-white font-medium mb-1">Message</label>
            <textarea
              placeholder="Type your message..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full border border-white opacity-30 rounded-md px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30"
            />
          </div>

          {/* Submit Button */}
          <Button
            text="Submit"
            variant="primary"
            className="mt-4 w-full bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={() => console.log("Primary Button Clicked")}
          />
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
