"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";

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

const UserForm = () => {
  const params = useParams();
  const router = useRouter();

  const [tourPackageId, setTourPackageId] = useState<string | null>(null);
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      tourPackageId: tourPackageId,
      travelDate: formData.date,
      totalPeople:
        formData.travellers === "5+" ? 5 : parseInt(formData.travellers),
      specialRequests: formData.message,
    };

    try {
      const response = await fetch(
        "https://yogeshbhai.ddns.net/api/tour/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorText = "Unknown error";
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData, null, 2);
        } else {
          const html = await response.text();
          errorText = `Non-JSON error response:\n${html}`;
        }

        console.error(`Booking failed:\n${errorText}`);
        alert(`Booking failed: ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log("✅ Booking successful:", result);

      // Reset form
      setFormData({
        date: "",
        name: "",
        email: "",
        phone: "",
        travellers: "",
        country: "",
        message: "",
        agree: false,
      });

      // Redirect to booking success page
      router.push(`/booking-success/${tourPackageId}`);
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-[#0E334F] p-6"
      >
        <TextDescription
          text="Looking for personalized experience? We organize privately guided journey which is mainly designed to fit your taste and interest. Please fill out the form below to get started."
          className="w-full max-w-[850px] mb-10 text-left"
        />

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
            I agree to Ace the Himalaya Terms and Conditions
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="bg-[#F7941D] hover:bg-[#E47312] text-white font-semibold py-2 px-6 rounded-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;