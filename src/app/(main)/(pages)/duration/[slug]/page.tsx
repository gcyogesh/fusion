import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import ImageDisplay from "@/components/atoms/ImageCard";
import Image from "next/image";
import Link from "next/link";


const durationSlugs = {
  "1-3-days": { min: 1, max: 3 },
  "4-7-days": { min: 4, max: 7 },
  "7-10-days": { min: 7, max: 10 },
  "10-15-days": { min: 10, max: 15 },
  "15-21-days": { min: 15, max: 21 },
  "21-plus-days": { min: 21, max: 99 },
};

const slugLabelMap: Record<string, string> = {
  "1-3-days": "1–3 Days",
  "4-7-days": "4–7 Days",
  "7-10-days": "7–10 Days",
  "10-15-days": "10–15 Days",
  "15-21-days":  "15–21 Days",
  "21-plus-days": "21+ Days",
  
};

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  duration: { days: number };
  overview: string;
  description: string;
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

export default async function DurationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const range = durationSlugs[slug as keyof typeof durationSlugs];

  if (!range) {
    return <div className="text-center py-12 text-gray-500">Invalid duration range.</div>;
  }

  let packages: Package[] = [];

  try {
    const res = await fetchAPI({
      endpoint: `tour/tour-packages/filter-by-duration?min=${range.min}&max=${range.max}`,
    });

    packages = res.data?.map((pkg: any) => ({
      ...pkg,
      duration: { days: pkg.duration?.days || 0 },
      location: pkg.destination || { city: "Multiple", country: "Locations" },
      imageUrls: pkg.gallery || [pkg.imageUrl || "/placeholder-image.jpg"],
    }));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return <div className="text-center py-12 text-red-500">Failed to load packages.</div>;
  }

  if (!packages.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No tour packages found for <strong>{slugLabelMap[slug]}</strong>.
      </p>
    );
  }

  return (
    <>
      <Breadcrumb currentnavlink={`Duration / ${slugLabelMap[slug] || "Duration"}`} />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <TextHeader
          text={`${slugLabelMap[slug]} Packages`}
          specialWordsIndices="2"
          size="medium"
          width={622}
          align="left"
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {packages.map((card) => (
            <Link href={`/itinerary/${card._id}`} key={card._id} className="flex flex-col gap-4">
              <div className="aspect-video">
                <ImageDisplay
                  src={card.gallery?.[0]}
                  variant="square"
                  snippetPosition="start"
                  title={card.title}
                  description={card.subtitle}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 font-medium text-[20px] text-[#7E7E7E]">
                    <Image
                      src={"/images/Location.svg"}
                      alt="Location"
                      width={20}
                      height={20}
                    />
                    {card.location?.city}, {card.location?.country}
                  </span>
                  <span className="flex items-center gap-2 font-medium text-[20px] text-[#7E7E7E]">
                    <Image
                      src={"/images/clock.svg"}
                      alt="Clock"
                      width={20}
                      height={20}
                    />
                    {card.duration?.days} Days
                  </span>
                </div>

                <TextHeader
                  text={card.overview}
                  size="small"
                  align="left"
                  width={410}
                  className="line-clamp-2"
                />
                <TextDescription text={card.subtitle} className="line-clamp-3" />

                <div className="w-full h-[1.5px] bg-[#C2C2C2]" />
                <div className="flex flex-row text-lg font-medium text-[#7E7E7E] text-[20px] mt-1">
                  Starting Price:
                  <span className="text-primary font-semibold ml-5">
                    ${card.basePrice || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
