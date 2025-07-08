import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { HiOutlineClock } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  duration: { days: number };
  basePrice: number;
  priceMax?: number;
  location: {
    city: string;
    country: string;
  };
  gallery: string[];
  slug: string;
  tag?: string;
  imageUrls?: string[];
}

const durationSlugs = {
  "1-3-days": { min: 1, max: 3 },
  "4-7-days": { min: 4, max: 7 },
  "7-10-days": { min: 7, max: 10 },
  "10-plus-days": { min: 10, max: 99 },
};

const slugLabelMap: Record<string, string> = {
  "1-3-days": "1–3 Days",
  "4-7-days": "4–7 Days",
  "7-10-days": "7–10 Days",
  "10-plus-days": "10+ Days",
};

export default async function DurationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const range = durationSlugs[slug as keyof typeof durationSlugs];

  if (!range) {
    return <div className="text-center py-12">Invalid duration range.</div>;
  }

  try {
    const res = await fetchAPI({
      endpoint: `tour/tour-packages/filter-by-duration?min=${range.min}&max=${range.max}`,
    });

    const packages: Package[] = res.data?.map((pkg: any) => ({
      ...pkg,
      duration: { days: pkg.duration?.days || 0 },
      location: pkg.destination || { city: "Multiple", country: "Locations" },
      imageUrls: pkg.gallery || [pkg.imageUrl || "/placeholder-image.jpg"],
    }));

    return (
      <>
          <Breadcrumb currentnavlink={`Duration/${slugLabelMap[slug] || "Duration"}`} />
        <section className="max-w-7xl mx-auto px-6 py-12">
          <TextHeader
            text={`${slugLabelMap[slug] || ""} Packages`}
            align="center"
            specialWordsIndices="2"
            size="medium"
            width={622}
            className="mb-4"
          />

          {packages.length === 0 ? (
            <p className="text-center text-gray-500">No packages available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Link href={`/itinerary/${pkg._id}`} key={pkg._id}>
                  <ImageDisplay
                    src={pkg.imageUrls?.[0]}
                    variant="square"
                    snippet={pkg.tag}
                    title={pkg.title}
                    description={pkg.subtitle}
                  />
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CiLocationOn className="w-4 h-4" />
                      {pkg.location.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-4 h-4" />
                      {pkg.duration.days} Days
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </>
    );
  } catch (error) {
    console.error("Error fetching packages:", error);
    return <div className="text-center py-12 text-red-500">Failed to load packages.</div>;
  }
}
