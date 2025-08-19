export const dynamic = "force-dynamic";
import { fetchAPI } from "@/utils/apiService";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { Destination, TourPackage } from "@/types";

interface Params {
  params: { slug: string };
}

export default async function Page({ params }: Params) {
  const { slug } = params;

  // Fetch destination and related package IDs
  const destinationRes = await fetchAPI({
    endpoint: `destinations/${slug}`,
  }) as {
    data: {
      destination: Destination;
      relatedPackages: { _id: string }[];
    };
  };

  const destination = destinationRes?.data?.destination;
  const relatedPackageIds = destinationRes?.data?.relatedPackages || [];

  // Fetch related packages by ID
  const relatedPackages: TourPackage[] = await Promise.all(
    relatedPackageIds.map(async (pkg) => {
      const res = await fetchAPI({
        endpoint: `tour/tour-packages/${pkg._id}`,
      }) as { data: TourPackage };
      return res.data;
    })
  );

  // Fetch all destinations for "Other Destinations" section
  const allDestinations = await fetchAPI({
    endpoint: "destinations",
  }) as { data: Destination[] };

  const destinations: Destination[] = allDestinations?.data ?? [];

  const herodata = {
    _id: destination._id,
    page: "Destination",
    title: destination.title,
    bannerImage: destination.imageUrls?.[0] || destination.image,
    image: "", // Optional floating image
  };

  return (
    <>
      <Breadcrumb currentnavlink={`Destination / ${destination?.title || "Destination"}`} />
      <HeroBanner herodata={herodata} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-10">
        {/* Destination Overview */}
        {destination ? (
          <div className="mt-4 space-y-2">
            <TextHeader text={destination.title} size="small" align="left" />
            <TextDescription text={destination.subtitle} className="text-lg font-medium" />
            {destination.description && (
              <TextDescription text={destination.description} className="line-clamp-3" />
            )}
          </div>
        ) : (
          <div className="text-red-600 text-lg">
            No destination found for slug: {slug}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-[1.5px] bg-[#C2C2C2] mt-10" />

        {/* Related Packages */}
        <div className="space-y-6">
          <TextHeader text={`Packages of ${destination.title}`} size="large" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPackages.map((card) => (
              <Link
                href={`/itinerary/${card._id}`}
                key={card._id}
                className="flex flex-col gap-4"
              >
                <div className="aspect-video">
                  <ImageDisplay
                    src={card.gallery?.[0]}
                    variant="square"
                    snippet="popular"
                    snippetPosition="start"
                    title={card.title}
                    description={card.description}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between text-sm ">
        <span className="flex items-center gap-2 font-medium text-[20px] text-[#7E7E7E] ">
          {card.title}
          
        </span>
                    <span className="flex items-center gap-2 font-medium text-[20px]  text-[#7E7E7E]">
                              <Image src={"/images/clock.svg"} alt="Clock" width={20} height={20}/>
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

                  <div className="w-full h-[1.5px] bg-[#C2C2C2]" />

                  <div className="text-[#7E7E7E] text-[20px] font-medium">
                    Starting Price:
                    <span className="text-primary font-semibold ml-2">
                      ${card.basePrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Other Destinations */}
        <section className="space-y-4">
          <TextHeader text="Other Destinations" size="large" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations
              .filter((item) => item.slug !== slug)
              .slice(0, 3)
              .map((item) => (
                <Link key={item._id} href={`/destinations/${item.slug}`}>
                  <div className="cursor-pointer">
                    <ImageDisplay
                      src={item.imageUrls?.[0] || item.image}
                      variant="smallrectangle"
                    />
                    <TextHeader
                      text={item.title}
                      size="small"
                      align="left"
                      className="mt-2"
                    />
                    <TextDescription text={item.subtitle} className="text-lg font-medium line-clamp-4" />
                      
                  
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </section>
    </>
  );
}
