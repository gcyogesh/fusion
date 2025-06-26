"use client";
import React, { useEffect, useState, use } from "react";
import { fetchAPI } from "@/utils/apiService";
import Button from "@/components/atoms/button";
import TourPackageForm from "@/components/molecules/adminForm/PackageForm";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import type { TourPackageFormData } from '@/components/molecules/adminForm/PackageForm';

interface Package {
  _id: string;
  title: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat?: string;
      lng?: string;
    };
  };
  duration?: {
    days?: number;
    nights?: number;
  };
  basePrice?: number;
  currency?: string;
  gallery?: string[];
  feature?: {
    groupSize?: { min?: string };
    tripDuration?: string;
    tripDifficulty?: string;
    meals?: string[];
    activities?: string[];
    accommodation?: string[];
    maxAltitude?: string;
    bestSeason?: string[];
    startEndPoint?: string;
  };
  [key: string]: any;
}

interface Destination {
  _id: string;
  title: string;
  [key: string]: any;
}

function PackageCard({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: Package;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imageSrc = (pkg.gallery && pkg.gallery[0]) || "/fallback.jpg";

  return (
    <div className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col transition-transform hover:scale-[1.025] hover:shadow-xl group">
      {/* Image */}
      <div className="relative h-56">
        <img
          src={imageSrc}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:brightness-95 transition"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src = "/fallback.jpg")
          }
        />

        {/* Price */}
        {pkg.basePrice !== undefined && (
          <div className="absolute top-3 left-3 bg-primary text-white text-base font-bold px-4 py-1 rounded-full shadow-lg">
            {pkg.currency?.toUpperCase() || "USD"} {pkg.basePrice.toFixed(2)}
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={onEdit}
            className="bg-white/90 hover:bg-primary/10 p-2 rounded-full shadow border border-primary/20 transition"
            title="Edit"
          >
            <FiEdit className="text-primary w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="bg-white/90 hover:bg-red-100 p-2 rounded-full shadow border border-red-200 transition"
            title="Delete"
          >
            <FiTrash className="text-red-500 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-xl font-bold mb-1 truncate" title={pkg.title}>{pkg.title}</h3>

        <div className="text-sm flex items-center gap-2 text-gray-500">
          <FaMapMarkerAlt className="text-primary/70" />
          {pkg.location?.city && pkg.location?.country
            ? `${pkg.location.city}, ${pkg.location.country}`
            : "Location unknown"}
        </div>

        <div className="text-sm flex items-center gap-2 text-gray-500">
          <FaClock className="text-primary/70" />
          {pkg.duration
            ? `${pkg.duration.days ?? "?"} Days ${pkg.duration.nights ?? "?"} Nights`
            : "Duration unknown"}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 text-center bg-gray-50 group-hover:bg-primary/5 transition">
        <button className="text-primary hover:underline font-semibold text-sm tracking-wide transition">
          View Detail
        </button>
      </div>
    </div>
  );
}

// Helper to map Package to TourPackageFormData shape
function mapPackageToFormData(pkg: Package, destinationId: string): TourPackageFormData {
  return {
    title: pkg.title || '',
    description: pkg.description || '',
    overview: pkg.overview || '',
    location: {
      city: pkg.location?.city || '',
      country: pkg.location?.country || '',
      coordinates: {
        lat: pkg.location?.coordinates?.lat?.toString() || '',
        lng: pkg.location?.coordinates?.lng?.toString() || '',
      },
    },
    duration: {
      days: pkg.duration?.days?.toString() || '',
      nights: pkg.duration?.nights?.toString() || '',
    },
    basePrice: pkg.basePrice?.toString() || '',
    currency: pkg.currency || '',
    itinerary: pkg.itinerary || [],
    inclusions: pkg.inclusions || [],
    exclusions: pkg.exclusions || [],
    highlights: pkg.highlights || [],
    quickfacts: pkg.quickfacts || [],
    feature: {
      groupSize: { min: pkg.feature?.groupSize?.min?.toString() || '' },
      tripDuration: pkg.feature?.tripDuration || '',
      tripDifficulty: pkg.feature?.tripDifficulty || '',
      meals: pkg.feature?.meals || [],
      activities: pkg.feature?.activities || [],
      accommodation: pkg.feature?.accommodation || [],
      maxAltitude: pkg.feature?.maxAltitude || '',
      bestSeason: pkg.feature?.bestSeason || [],
      startEndPoint: pkg.feature?.startEndPoint || '',
    },
    type: pkg.type || '',
    tags: pkg.tags || [],
    rating: pkg.rating || '',
    destination: destinationId,
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackageFormData> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("Fetching destination for slug:", slug);
        const destRes: any = await fetchAPI({
          endpoint: `destinations/${slug}`,
        });
        console.log("Destination response:", destRes);
        const fetchedDestination = destRes.data.destination;
        setDestination(fetchedDestination);
        const relatedIds = destRes.data.relatedPackages?.map(
          (pkg: { _id: string }) => pkg._id
        ) || [];
        console.log("Related package IDs:", relatedIds);
        const packages = await Promise.all(
          relatedIds.map(async (id: string) => {
            const pkgRes: any = await fetchAPI({
              endpoint: `tour/tour-packages/${id}`,
            });
            console.log("Fetched package:", pkgRes.data);
            return pkgRes.data;
          })
        );
        console.log("All fetched packages:", packages);
        setRelatedPackages(packages);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setErrorMessage(error.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  const handleEdit = (pkg: Package) => {
    setEditingPackage(mapPackageToFormData(pkg, destination?._id || ''));
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleDelete = (pkg: Package) => {
    alert(`Delete package: ${pkg.title}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Destination Info */}
        {destination && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold border-b border-gray-300 pb-2">
              {destination.title}
            </h1>
            <p className="text-gray-700 mt-2 text-sm">
              This type of trip includes many destinations and varieties of
              activities within Nepal. They are mostly the experiences that are
              easier to undertake as compared to mountain activities, jungle
              safari, helicopter tours, and other activities.
            </p>
          </div>
        )}

        {/* Header Row: Section Title & Add Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Available Packages</h2>
          {!showForm && (
            <Button
              text="Add New Package"
              className="!bg-primary !text-white !px-6 !py-2 !rounded-lg !shadow hover:!bg-primary/90 transition"
              onClick={handleAdd}
            />
          )}
        </div>

        {/* Show Form (inline, right after header) */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-8">
            <TourPackageForm 
              onClose={() => setShowForm(false)} 
              initialData={editingPackage || undefined} 
              destinationId={destination?._id || ''}
              destinationTitle={destination?.title || ''}
            />
          </div>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 mb-8">
            <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-primary text-lg font-medium">Loading packages...</span>
          </div>
        ) : (
          /* Package Grid or Empty State */
          relatedPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {relatedPackages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  onEdit={() => handleEdit(pkg)}
                  onDelete={() => handleDelete(pkg)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 mb-8 bg-white rounded-xl shadow-inner border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8zm-6 4v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span className="text-xl font-semibold text-gray-700">No packages found</span>
              <span className="text-sm mt-1 text-gray-400">Try adding a new package to get started!</span>
            </div>
          )
        )}

        {/* Error */}
        {errorMessage && (
          <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}
