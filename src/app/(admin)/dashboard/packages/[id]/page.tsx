


import { fetchAPI } from "@/utils/apiService";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import Link from "next/link";

interface Package {
  _id: string;
  title: string;
  description: string;
  destinationId?: string;
  activityId?: string;
  imageUrls?: string[];
  gallery?: string[];
  slug: string;
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: { destinationId?: string; activityId?: string };
}) {
  const res = await fetchAPI<{ data: Package[] }>({ endpoint: "tour/tour-packages/685259d69bfde1c8d18def6c" });
  let packages: Package[] = res?.data || [];

  if (searchParams?.destinationId) {
    packages = packages.filter(pkg => pkg.destinationId === searchParams.destinationId);
  } else if (searchParams?.activityId) {
    packages = packages.filter(pkg => pkg.activityId === searchParams.activityId);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <TextHeader text="Packages" size="large" align="left" />
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {packages.map(pkg => (
            <Link
              href={`/itinerary/${pkg._id}`}
              key={pkg._id}
              className="border rounded-lg p-4 flex flex-col gap-2 hover:shadow-lg transition"
            >
              <ImageDisplay
                src={pkg.gallery?.[0] || pkg.imageUrls?.[0] || "/placeholder-image.jpg"}
                variant="square"
                title={pkg.title}
                description={pkg.description}
              />
              <h3 className="text-lg font-semibold mt-2">{pkg.title}</h3>
              <p className="text-gray-600">{pkg.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 mt-8">No packages found for this filter.</div>
      )}
    </section>
  );
}