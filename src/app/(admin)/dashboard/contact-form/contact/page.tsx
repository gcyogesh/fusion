export const dynamic = "force-dynamic";
import { fetchAPI } from "@/utils/apiService"
import React from "react"
import ContactInquiriesClient from "./ContactInquiriesClient"

export default async function ContactDashboard() {
  let inquiries: any[] = []
  let error = null
  try {
    const res = await fetchAPI({ endpoint: "contact" })
    inquiries = Array.isArray((res as any)?.message) ? (res as any).message : []
  } catch (e: any) {
    error = e.message || "Failed to fetch contact inquiries."
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
          {error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : inquiries.length === 0 ? (
        <div className="text-gray-500">No inquiries found.</div>
      ) : (
        <ContactInquiriesClient inquiries={inquiries} />
      )}
    </div>
  )
}