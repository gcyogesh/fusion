"use client";
import React, { useState, FormEvent } from "react";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";
const UserForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    email: "",
    phone: "",
    travellers: "",
    country: "",
    message: "",
    agree: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl p-6 bg-white rounded-xl shadow border border-[#0E334F]"
    >
        
      <TextDescription
  text="Looking for personalized experience? We organize privately guided journey which is mainly designed to fit your taste and interest. Please fill out the form below to get started."
  className="w-full max-w-[850px]  mb-10 text-left "
/>
      

      {/* First row: Date and Name */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <select
          required
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="border border-gray-300 p-2 rounded w-full text-gray-700"
        >
          <option value="">Choose your own date</option>
          <option value="2025-06-10">June 10, 2025</option>
          <option value="2025-06-20">June 20, 2025</option>
        </select>

        <input
          required
          type="text"
          placeholder="Traveler’s Full Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* Second row: Email and Phone */}
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

      {/* Third row: No. of Travellers and Country */}
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

      {/* Message */}
      <textarea
        placeholder="Place your Comments Here"
        value={formData.message}
        onChange={(e) => handleChange("message", e.target.value)}
        className="border border-gray-300 p-2 rounded w-full h-[185px] mb-4 resize-none"
      />

      {/* Checkbox */}
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
          I agree to Ace the Himalaya Terms and Conditions
        </label>
      </div>

      
      <div>
        <Button
          text="Submit"
          variant="primary"
          className="bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold  rounded-full"
        />
      </div>
    </form>
  );
};

export default UserForm;
