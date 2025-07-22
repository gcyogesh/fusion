import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import ImageDisplay from "@/components/atoms/ImageCard";
import Image from "next/image";
import Link from "next/link";

interface Params {
  slug: string;
}

type Tour = {
  _id: string;
  title: string;
  description: string;
  overview: string;
  gallery?: string[];
  image: string;
  basePrice?: number;
  location?: {
    city: string;
    country: string;
  };
  duration?: {
    days: number;
    nights: number;
  };
};

export default async function ActivityCategoryPage({ params }: { params: Params }) {
  let tours: Tour[] = [];

  try {
    const response = await fetchAPI<{ data: Tour[] }>({
      endpoint: `tour/tour-packages/category/slug/${params.slug}`,
      method: "GET",
      revalidateSeconds: 60,
    });

    if (response?.data && Array.isArray(response.data)) {
      tours = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch category by slug:", error);
  }

  if (!tours.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No tour packages found for <strong>{params.slug}</strong>.
      </p>
    );
  }

  return (
    <>
      <Breadcrumb currentnavlink={`Activities / ${params.slug.replace(/-/g, " ")}`} />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <TextHeader
          text={`${params.slug.replace(/-/g, " ")} Packages`}
          specialWordsIndices="2"
          size="medium"
          width={622}
          align="left"
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tours.map((card) => (
            <Link
              href={`/itinerary/${card._id}`}
              key={card._id}
              className="flex flex-col gap-4"
            >
              <div className="aspect-video">
                <ImageDisplay
                  src={card.gallery?.[0]}
                  variant="square"
                  snippetPosition="start"
                  title={card.title}
                  description={card.description || ""}
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
                <TextDescription text={card.description} className="line-clamp-3" />
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
