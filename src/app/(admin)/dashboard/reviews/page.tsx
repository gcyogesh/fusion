import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI, APIResponse } from "@/utils/apiService";
import React from "react";

export default async function ReviewsPage() {
  const reviewsData: APIResponse<any[]> = await fetchAPI({ endpoint: "reviews" });

  const transformedData = Array.isArray(reviewsData.data)
    ? reviewsData.data.map((review) => ({
        ...review,

        guestName: review.guestInfo?.name || "N/A",
        guestEmail: review.guestInfo?.email || "N/A",
        tourTitle: review.tour?.title || "No Tour",
        formattedDate: new Date(review.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        truncatedComment:
          review.comment?.length > 50
            ? `${review.comment.substring(0, 50)}...`
            : review.comment,
        statusDisplay:
          review.status?.charAt(0).toUpperCase() + review.status?.slice(1) ||
          "Unknown",

        name: review.guestInfo?.name || "",
        email: review.guestInfo?.email || "",
        title: review.tour?.title || "",
      }))
    : [];

  return (
    <>
      <AdminTable
        title="Reviews Management"
        buttonText="Add Review"
        data={transformedData}
        columns={[
          { label: "Guest Name", accessor: "guestName" },
          { label: "Email", accessor: "guestEmail" },
          { label: "Tour", accessor: "tourTitle" },
          { label: "Rating", accessor: "rating" },
          { label: "Comment", accessor: "truncatedComment" },
          { label: "Status", accessor: "statusDisplay" },
          { label: "Date", accessor: "formattedDate" },
        ]}
        endpoint={"reviews"}
      />
    </>
  );
}
