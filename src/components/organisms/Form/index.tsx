"use client";
import Button from "@/components/atoms/button";
import React, { useState, FormEvent } from "react";
;

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
  width = "full",
  formTitle,

}) => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  const nameFields = [

    { name: "Name", label: "Name", placeholder: "Enter your full name" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items- px-4">
        <div
          className={`bg-[#0E334F] w-[520px] rounded-3xl shadow-md border border-white  flex flex-col gap-7 
          }`}
          style={{ padding }}
        >
          {formTitle && (
            <h2 className="text-2xl font-semibold text-white text-center">
              {formTitle}
            </h2>
          )}

          {/* Name */}
          <div className="w-full flex flex-col md:flex-row gap-6">
            {nameFields.map(({ name, label, placeholder }) => (
              <div key={name} className="flex flex-col w-full">
                <label className="text-sm text-white  font-medium mb-1">
                  {label}
                </label>
                <input
                  required
                  type="text"
                  placeholder={placeholder}
                  value={(formData as never)[name]}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="border border-white opacity-30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus: ring-white  placeholder:text-white placeholder:opacity-30"
                />
              </div>
            ))}
          </div>

           {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-white font-medium mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="fusion@gmail.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border  rounded-md border-white opacity-30 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white  placeholder:text-white placeholder:opacity-30"
            />
          </div>


          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm text-white font-medium mb-1">
              Phone 
            </label>
            <input
              required
              type="tel"
              placeholder="+977-"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="border border-white opacity-30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white placeholder:opacity-30 "
            />
          </div>

         
          {/* Additional Info */}
          <div className="flex flex-col">
            <label className="text-sm text-white font-medium mb-1">
              Message
            </label>
            <textarea
              placeholder="Type Message"
              value={formData.message}
              onChange={(e) => handleChange("additionalInfo", e.target.value)}
              className="border border-white opacity-30 rounded-md px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-white  placeholder:text-white placeholder:opacity-30"
            />
          </div>
            {/* Buttons */}
        <Button 
            text="Submit"
            variant="primary"
            className="mt-6 w-full bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={() => console.log("Primary Button Clicked")}
        />
        </div>

      
        
      </div>
    </form>
  );
};

export default ContactForm;
