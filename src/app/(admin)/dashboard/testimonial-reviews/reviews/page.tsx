import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI, APIResponse } from "@/utils/apiService";
import React from "react";

export default async function ReviewsPage() {
  const reviewsData: APIResponse<any[]> = await fetchAPI({ endpoint: "reviews" });

  return (
    <>
      <AdminTable
        title="Reviews Management"
        buttonText="Add Review"
        data={reviewsData.data}

        endpoint={"reviews"} columns={[]}      />
    </>
  );
}