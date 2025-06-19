import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import ImageDisplay from "@/components/atoms/ImageCard";

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
            <div className="lg:col-span-2">
              <ImageDisplay
                src={destinationdata[0].imageUrls?.[0]}
                variant="rectangle"
                width={840}
                height={430}
                title={destinationdata[0].title}
                description={destinationdata[0].subtitle}
              />
            </div>
          )}

          {destinationdata[1] && (
            <div>
              <ImageDisplay
                src={destinationdata[1].imageUrls?.[0]}
                variant="square"
                title={destinationdata[1].title}
                description={destinationdata[1].subtitle}
              />
            </div>
          )}
        </div>

        {/* Second Row: 3 Square Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinationdata.slice(2, 5).map((card, index) => (
            <div key={index}>
              <ImageDisplay
                src={card?.src || card?.imageUrls?.[0]}
                variant="square"
                alt="Popular destination"
                snippet="popular"
                title={card?.title || "Untitled"}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
