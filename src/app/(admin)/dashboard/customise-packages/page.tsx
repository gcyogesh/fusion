"use client"
import TourPackageForm from "@/components/molecules/adminForm/PackageForm";
import React, { useState } from "react";

export default async function dashboard() {

  // Add state for showing the form
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        className="px-4 py-2 bg-primary text-white rounded-lg mb-4"
        onClick={() => setShowForm(true)}
      >
        Add New Package
      </button>
      {showForm && (
        <TourPackageForm initialData={undefined} onClose={() => setShowForm(false)} />
      )}
      {/* You can render AdminTable or other content here */}
    </>
  );
}