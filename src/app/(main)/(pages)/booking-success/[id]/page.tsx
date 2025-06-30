"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

const BookingSuccessPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`https://yogeshbhai.ddns.net/api/tour/tour-packages`);
        if (response.ok) {
          const result = await response.json();
          const found = result.data.find((pkg: TourPackage) => pkg._id === id);
          if (found) {
            setTourPackage(found);
          } else {
            console.error("Package not found with ID:", id);
          }
        } else {
          console.error("Failed to fetch tour packages");
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading package details...</p>;
  }

  if (!tourPackage) {
    return <p className="text-center mt-10">No package found for ID: {id}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-300">
        <img
          src={tourPackage.gallery[0]}
          alt={tourPackage.title}
          className="w-full h-64 object-cover rounded-t-xl"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#0E334F] mb-2">
            {tourPackage.title}
          </h1>
          <p className="mb-2 text-gray-600">
            📍 {tourPackage.location.city}, {tourPackage.location.country}
          </p>
          <p className="text-gray-700 mb-4">{tourPackage.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
            <div>
              <p className="text-lg font-semibold text-[#F7941D]">
                {tourPackage.currency.toUpperCase()} {tourPackage.basePrice}
              </p>
              <p className="text-sm text-gray-600">Base Price</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[#0E334F]">
                {tourPackage.duration.days}D/{tourPackage.duration.nights}N
              </p>
              <p className="text-sm text-gray-600">Duration</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-600">
                {tourPackage.gallery.length}
              </p>
              <p className="text-sm text-gray-600">Images</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-blue-600">Confirmed</p>
              <p className="text-sm text-gray-600">Booking Status</p>
            </div>
          </div>

          <Link
            href={`/payment/${tourPackage._id}`}
            className="inline-block bg-[#F7941D] hover:bg-[#E47312] text-white px-6 py-2 rounded-full font-medium"
          >
            Pay Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;