"use client";

import React, { useEffect, useState } from "react";
import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI } from "@/utils/apiService";
import { useParams } from "next/navigation";

interface Package {
  id: string;
  title: string;
  [key: string]: any;
}

export default function Page() {
  const { id } = useParams(); // CSR route param hook
  const [data, setData] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const response = await fetchAPI<{ data: Package[] | Package }>({
          endpoint: `tour/tour-packages/${id}`,
        });

        if (Array.isArray(response.data)) {
          setData(response.data);
        } else if (response.data) {
          setData([response.data]);
        } else {
          setErrorMessage("No data found.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage("Tour package not found.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading packages...</p>
      </div>
    );
  }

  if (errorMessage || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-xl font-semibold text-red-600">{errorMessage}</h2>
      </div>
    );
  }

  return (
    <AdminTable
      title="Packages Management"
      buttonText="Add Packages"
      data={data}
      columns={[{ label: "Packages title", accessor: "title" }]}
      endpoint={`tour/tour-packages/${id}`}
    />
  );
}
