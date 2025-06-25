"use client"
import { use } from 'react';
import Button from "@/components/atoms/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import React, { useState } from "react";
import TourPackageForm from "@/components/molecules/adminForm/PackageForm";
import Breadcrumb from '@/components/atoms/breadcrumb';
interface Package {
  id: string;
  _id?: string;
  title: string;
  imageUrls?: string;
  gallery?: string[];
  reviewTitle?: string;
  [key: string]: any;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);

  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<Package[] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/tour/tour-packages/${id}`);
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setData(result.data);
        } else if (result.data) {
          setData([result.data]);
        } else {
          setErrorMessage("No data found.");
        }
      } catch (error) {
        setErrorMessage("Tour package not found.");
      }
    }
    if (id) fetchData();
  }, [id]);

  const pkg = data && data.length > 0 ? data[0] : null;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-2xl mx-auto">
     
        {pkg ? (
          <>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 flex flex-col items-center p-0 mb-10">
              <div className="relative w-full h-64">
                <img
                  src={pkg.imageUrls || pkg.gallery?.[0] || "/fallback.jpg"}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = '/fallback.jpg'; }}
                />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <Button
                    text=""
                    leftIcon={<FiEdit className="text-blue-600 w-5 h-5" />}
                    variant="secondary"
                    className="!px-3 !py-2 bg-white/90 hover:bg-blue-100 rounded-full shadow"
                    onClick={() => {
                      setShowForm(true);
                      setTimeout(() => {
                        const formEl = document.getElementById('tour-package-form');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  />
                  <Button
                    text=""
                    leftIcon={<FiTrash className="text-red-600 w-5 h-5" />}
                    variant="secondary"
                    className="!px-3 !py-2 bg-white/90 hover:bg-red-100 rounded-full shadow"
                    onClick={() => alert('Delete package')}
                  />
                </div>
              </div>
              <div className="w-full p-6 flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-primary mb-1">{pkg.title}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <MdLocationOn className="text-yellow-400 text-xl drop-shadow" />
                  <span className="text-black font-semibold text-lg drop-shadow">{pkg.location?.city}, {pkg.location?.country}</span>
                </div>
                <div className="text-gray-700 text-base mb-2">{pkg.description}</div>
                <div className="mt-2 mb-2">
                  <span className="text-primary font-semibold">Review Title:</span> <span className="text-black">{pkg.reviewTitle || 'No review yet'}</span>
                </div>
                {/* Add more package details here as needed */}
              </div>
            </div>
            {showForm && <div id="tour-package-form"><TourPackageForm initialData={pkg} onClose={() => setShowForm(false)} /></div>}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 text-2xl mb-4">{errorMessage || 'No data found.'}</div>
            <Button text="Add Package" variant="primary" onClick={() => {
              setShowForm(true);
              setTimeout(() => {
                const formEl = document.getElementById('tour-package-form');
                if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} />
            {showForm && <div id="tour-package-form"><TourPackageForm onClose={() => setShowForm(false)} /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
