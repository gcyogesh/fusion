"use client";
import { fetchAPI } from "@/utils/apiService";
import { useState, useEffect } from "react";
import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineClock } from "react-icons/hi";
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
  imageUrls?: string[];
  slug: string;
  tag?: string;
  city?: string;
  
}


export default function DurationPackages() {
  const [packagesByDuration, setPackagesByDuration] = useState<Record<string, Package[]>>({});
  const [loading, setLoading] = useState(true);

  const durationGroups = [
    { label: "1–3 Days", slug: "1-3-days", min: 1, max: 3 },
    { label: "4–7 Days", slug: "4-7-days", min: 4, max: 7 },
    { label: "7–10 Days", slug: "7-10-days", min: 7, max: 10 },
    { label: "10+ Days", slug: "10-plus-days", min: 10, max: 99 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data: Record<string, Package[]> = {};
      
      for (const group of durationGroups) {
        try {
          const res = await fetchAPI({
            endpoint: `tour/tour-packages/filter-by-duration?min=${group.min}&max=${group.max}`
          });
          data[group.slug] = res.data?.map((pkg: any) => ({
            ...pkg,
            duration: { days: pkg.duration?.days || 0 },
            priceMin: pkg.basePrice,
            priceMax: pkg.priceMax || pkg.basePrice * 1.5,
            location: pkg.destination?.name || "Multiple Locations",
            imageUrls: pkg.gallery || [pkg.imageUrl || "/placeholder-image.jpg"],
            tag: pkg.tag || (group.label.includes("10+") ? "Extended" : "Popular")
          })) || [];
        } catch (error) {
          console.error(`Error fetching ${group.label}:`, error);
          data[group.slug] = [];
        }
      }
      
      setPackagesByDuration(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        Loading packages...
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">
      <TextHeader
        text="Journeys Tailored to Your Timeline"
        buttonText="Duration Packages"
        specialWordsIndices="3"
        size="medium"
        width={622}
        align="center"
        className="mb-4"
      />

      {durationGroups.map((group) => (
        <div key={group.slug} className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">{group.label} Packages</h2>
          
          {packagesByDuration[group.slug]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {packagesByDuration[group.slug].map((pkg) => (
                <Link 
                  href={`/itinerary/${pkg._id}`}
                  key={pkg._id} 
                  className="flex flex-col gap-4"
                >
                  <div className="aspect-video">
                    <ImageDisplay
                      src={pkg.gallery?.[0] || pkg.imageUrls?.[0] || "/placeholder-image.jpg"}
                      variant="square"
                      snippet={pkg.tag}
                      snippetPosition="start"
                      title={pkg.title}
                      description={pkg.subtitle}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm text-[#5A5A5A]">
                      <span className="flex items-center gap-1 font-bold">
                        <CiLocationOn className="w-4 h-4" />
                        {pkg.location.city}
                      </span>
                      <span className="flex items-center font-bold gap-1">
                        <HiOutlineClock className="w-4 h-4" />
                        {pkg.duration.days} Days
                      </span>
                    </div>

                    <TextHeader 
                      text={pkg.title} 
                      size="small" 
                      align="left" 
                      width={410} 
                    />

                    <div className="w-full h-[1.5px] bg-[#C2C2C2]" />

                    <div className="flex flex-row justify-between text-lg font-semibold text-[#5A5A5A] mt-1">
                      Start From{" "}
                      <span className="text-primary">
                        ${pkg.basePrice}
                        {pkg.priceMax && pkg.priceMax > pkg.basePrice ? `-$${pkg.priceMax}` : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No packages found for {group.label}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}