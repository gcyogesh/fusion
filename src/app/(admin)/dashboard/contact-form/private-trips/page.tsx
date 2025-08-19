
export const dynamic = "force-dynamic";
import { fetchAPI } from "@/utils/apiService";
import React from "react";
import PrivateInquiriesClient from "./PrivateQuiriesClient";
export default async function PrivateTripDashboard() {
  let inquiries: any[] = [];
  let error = null;

  try {
    const res = await fetchAPI({ endpoint: "privatetrip" });
    inquiries = Array.isArray((res as any)?.message) ? (res as any).message : [];
  } catch (e: any) {
    error = e.message || "Failed to fetch private trip inquiries.";
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Private Trip Inquiries</h1>
        <p className="text-xl text-gray-600">Manage and respond to private trip requests</p>
      </div>
      
      {error ? (
        <div className="text-red-500 font-semibold text-center">{error}</div>
      ) : inquiries.length === 0 ? (
        <div className="text-gray-500 text-center">No private trip inquiries found.</div>
      ) : (
        <PrivateInquiriesClient inquiries={inquiries} />
      )}
    </div>
  );
}