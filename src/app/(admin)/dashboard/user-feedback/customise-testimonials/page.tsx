export const dynamic = "force-dynamic";
import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI, APIResponse } from "@/utils/apiService";
import React from "react";

export default async function CustomiseTestimonials() {
  const testimonialsData: APIResponse<any[]> = await fetchAPI({ endpoint: "testimonials" });

  return (
    <>
      <AdminTable
        title="Testimonials Management"
        buttonText="Add Testimonial"
        data={Array.isArray(testimonialsData.data) ? testimonialsData.data : []}
        columns={[
          { label: "Profile Images", accessor: "profileImage" },
          { label: "Name", accessor: "name" },
          { label: "Message", accessor: "message" },
          { label: "Rating", accessor: "rating" },
          { label: "Location", accessor: "location" },
          { label: "Position", accessor: "position" },
        ]}
        endpoint="testimonials"
      />
    </>
  );
}
