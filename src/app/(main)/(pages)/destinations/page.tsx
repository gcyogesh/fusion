import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import ImageDisplay from "@/components/atoms/ImageCard";
import Link from "next/link";

export default async function DestinationPage() {
  const destination = await fetchAPI({ endpoint: "destinations" });
  const destinationdata = destination?.data || [];

  const herodata = await fetchAPI({ endpoint: "herobanner/destinations" });

  return (
    <>
      <Breadcrumb currentnavlink={"destinations"} />
      <HeroBanner herodata={herodata?.data || []} />

      <section className="max-w-7xl mx-auto px-4">
        {/* First Row: Rectangle + Square */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {destinationdata[0] && (
            <Link
              href={`/destinations/${destinationdata[0].slug}`}
              className="lg:col-span-2 block"
            >
              <ImageDisplay
                src={destinationdata[0].imageUrls?.[0]}
                variant="rectangle"
                width={840}
                height={430}
                title={destinationdata[0].title}
                description={destinationdata[0].subtitle}
                totalTrips={destinationdata[0].totalTrips}
              />
            </Link>
          )}

          {destinationdata[1] && (
            <Link
              href={`/destinations/${destinationdata[1].slug}`}
              className="block"
            >
              <ImageDisplay
                src={destinationdata[1].imageUrls?.[0]}
                variant="square"
                title={destinationdata[1].title}
                description={destinationdata[1].subtitle}
                totalTrips={destinationdata[1].totalTrips}
              />
            </Link>
          )}
        </div>

        {/* Second Row: 3 Square Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinationdata.slice(2, 5).map((card, index) => (
            <Link
              href={`/destinations/${card.slug}`}
              key={card.slug}
              className="block"
            >
              <ImageDisplay
                src={card?.src || card?.imageUrls?.[0]}
                variant="square"
                alt="Popular destination"
                title={card?.title || "Untitled"}
                totalTrips={card?.totalTrips}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
