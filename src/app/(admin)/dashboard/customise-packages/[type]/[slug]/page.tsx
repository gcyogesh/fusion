"use client";
import React, { useEffect, useState, use } from "react";
import { fetchAPI } from "@/utils/apiService";
import Button from "@/components/atoms/button";
import TourPackageForm from "@/components/molecules/adminForm/PackageForm";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import type { TourPackageFormData } from '@/components/molecules/adminForm/PackageForm';
import Alert from "@/components/atoms/alert";

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

interface DestinationOrActivity {
  _id: string;
  title: string;
  [key: string]: any;
}

function PackageCard({
  pkg,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  pkg: Package;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
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
        <button className="text-primary hover:underline font-semibold text-sm tracking-wide transition" onClick={onViewDetail}>
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
    gallery: pkg.gallery || [],
  };
}

function PackageDetailsModal({ pkg, onClose }) {
  if (!pkg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary/10 text-primary border border-gray-200"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-4">{pkg.title}</h2>
        <p className="mb-3 text-gray-700 text-lg">{pkg.description}</p>
        <p className="mb-3 text-gray-600 italic">{pkg.overview}</p>
        <div className="mb-3 text-base text-gray-500">
          <strong>Location:</strong> {pkg.location?.city}, {pkg.location?.country} <br/>
          <strong>Coordinates:</strong> {pkg.location?.coordinates?.lat}, {pkg.location?.coordinates?.lng}
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Duration:</strong> {pkg.duration?.days} Days {pkg.duration?.nights} Nights
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Price:</strong> {pkg.currency?.toUpperCase()} {pkg.basePrice}
        </div>
        {pkg.gallery && pkg.gallery.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-lg">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pkg.gallery.map((img, idx) => (
                <img key={idx} src={img} alt={pkg.title + ' ' + (idx+1)} className="w-full h-40 object-cover rounded border" />
              ))}
            </div>
          </div>
        )}
        {pkg.googleMapUrl && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-lg">Google Map Image</h3>
            <img src={pkg.googleMapUrl} alt="Google Map" className="w-72 h-48 object-cover rounded border" />
          </div>
        )}
        <div className="mb-3 text-base text-gray-500">
          <strong>Features:</strong>
          <ul className="list-disc ml-6">
            <li>Group Size: {pkg.feature?.groupSize?.min}</li>
            <li>Trip Duration: {pkg.feature?.tripDuration}</li>
            <li>Difficulty: {pkg.feature?.tripDifficulty}</li>
            <li>Max Altitude: {pkg.feature?.maxAltitude}</li>
            <li>Start/End Point: {pkg.feature?.startEndPoint}</li>
            <li>Best Season: {pkg.feature?.bestSeason?.join(', ')}</li>
            <li>Meals: {pkg.feature?.meals?.join(', ')}</li>
            <li>Activities: {pkg.feature?.activities?.join(', ')}</li>
            <li>Accommodation: {pkg.feature?.accommodation?.join(', ')}</li>
          </ul>
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Inclusions:</strong> {pkg.inclusions?.join(', ')}
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Exclusions:</strong> {pkg.exclusions?.join(', ')}
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Highlights:</strong> {pkg.highlights?.join(', ')}
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Quick Facts:</strong> {pkg.quickfacts?.join(', ')}
        </div>
        <div className="mb-3 text-base text-gray-500">
          <strong>Tags:</strong> {pkg.tags?.join(', ')}
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: { type: string; slug: string } }) {
  const { type, slug } = params;

  const [entity, setEntity] = useState<DestinationOrActivity | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackageFormData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'confirm' | 'success' | 'error' | 'warning';
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ show: false, type: 'confirm', message: '' });
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let endpoint = '';
        if (type === 'destinations') {
          endpoint = `destinations/${slug}`;
        } else if (type === 'activities') {
          endpoint = `activities/${slug}`;
        } else {
          setErrorMessage('Unknown type.');
          setLoading(false);
          return;
        }
        const res: any = await fetchAPI({ endpoint });
        const entity = res.data.destination || res.data.activity || res.data;
        setEntity(entity);
        const relatedIds = res.data.relatedPackages?.map((pkg: { _id: string }) => pkg._id) || [];
        const packages = await Promise.all(
          relatedIds.map(async (id: string) => {
            const pkgRes: any = await fetchAPI({ endpoint: `tour/tour-packages/${id}` });
            return pkgRes.data;
          })
        );
        setRelatedPackages(packages);
      } catch (error: any) {
        setErrorMessage(error.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    if (slug && type) fetchData();
  }, [slug, type]);

  const handleEdit = (pkg: Package) => {
    setEditingPackage(mapPackageToFormData(pkg, entity?._id || ''));
    setShowForm(true);
    setAlert({
      show: true,
      type: 'success',
      message: `Editing package: ${pkg.title}`,
      onConfirm: () => setAlert((a) => ({ ...a, show: false })),
    });
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleDelete = (pkg: Package) => {
    setAlert({
      show: true,
      type: 'confirm',
      message: `Are you sure you want to delete the package "${pkg.title}"? This action cannot be undone!`,
      onConfirm: async () => {
        setAlert((a) => ({ ...a, show: false }));
        setDeletingPackageId(pkg._id);
        try {
          await fetchAPI({
            endpoint: `tour/tour-packages/${pkg._id}`,
            method: 'DELETE',
          });
          setRelatedPackages((prev) => prev.filter((p) => p._id !== pkg._id));
          setAlert({
            show: true,
            type: 'success',
            message: `Package "${pkg.title}" deleted successfully!`,
            onConfirm: () => setAlert((a) => ({ ...a, show: false })),
          });
        } catch (error: any) {
          setAlert({
            show: true,
            type: 'error',
            message: error.message || 'Failed to delete package.',
            onConfirm: () => setAlert((a) => ({ ...a, show: false })),
          });
        } finally {
          setDeletingPackageId(null);
        }
      },
      onCancel: () => setAlert((a) => ({ ...a, show: false })),
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 py-10 px-4">
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onConfirm={alert.onConfirm || (() => setAlert((a) => ({ ...a, show: false })))}
        onCancel={alert.onCancel}
      />
      {selectedPackage && (
        <PackageDetailsModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
      <div className="max-w-6xl mx-auto">
        {/* Entity Info */}
        {entity && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold border-b border-gray-300 pb-2">
              {entity.title}
            </h1>
            <p className="text-gray-700 mt-2 text-sm">
              {type === 'destinations' && (
                <>This type of trip includes many destinations and varieties of activities within Nepal. They are mostly the experiences that are easier to undertake as compared to mountain activities, jungle safari, helicopter tours, and other activities.</>
              )}
              {type === 'activities' && (
                <>This section is for managing packages related to the selected activity.</>
              )}
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
              destinationId={entity?._id || ''}
              destinationTitle={entity?.title || ''}
              type={type}
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
                  onViewDetail={() => setSelectedPackage(pkg)}
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