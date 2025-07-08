import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService"; // adjust path as needed

type Tour = {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  totalTrips?: number;
};

export default async function Deals() {
  let deals: Tour[] = [];

  try {
    const response = await fetchAPI<{
      data: Tour[];
      success: boolean;
    }>({
      endpoint: "tour/tour-packages/tag/special",
      method: "GET",
      revalidateSeconds: 60, // optional: for ISR
    });

    if (response && Array.isArray(response.data)) {
      deals = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch special deals:", error);
  }

  if (!deals.length) {
    return <p className="text-center py-10 text-gray-500">No special deals found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8">
      {deals.map((item) => (
        <ImageDisplay
          key={item._id}
          src={item.image}
          alt={item.title}
          title={item.title}
          description={item.description}
          createdAt={item.createdAt}
          totalTrips={item.totalTrips}
          variant="rectangle"
          showOverlayContent={true}
        />
      ))}
    </div>
  );
}
