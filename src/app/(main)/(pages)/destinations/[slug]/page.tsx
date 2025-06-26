import { fetchAPI } from "@/utils/apiService";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import Link from "next/link";

interface Destination {
  [x: string]: unknown;
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageUrls?: string[];
  slug: string;
}

interface Params {
  params: { slug: string };
}

export default async function Page({ params }: Params) {
  const { slug } = params;

  const destinationData = await fetchAPI({ endpoint: "destinations" });
  const destinations: Destination[] = destinationData?.data || [];

  const destination: Destination | undefined = destinations.find(
    (item) => item.slug === slug
  );

  const herodata = await fetchAPI({ endpoint: "herobanner/destinations" });

  return (
    <>
      <Breadcrumb currentnavlink={destination?.title || "Destination"} />
      <HeroBanner herodata={herodata?.data || []} />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {destination ? (
              <div className="flex flex-col">
                <ImageDisplay
                  src={destination.imageUrls?.[0] || destination.image}
                  variant="smallrectangle"
                />
                <div className="mt-4">
                  <TextHeader text={destination.title} size="small" align="left" />
                  <h3 className="text-lg font-medium text-gray-600">
                    {destination.subtitle}
                  </h3>
                  <TextDescription text={destination.description} />
                </div>
              </div>
            ) : (
              <div className="text-red-600 text-lg">
                No destination found for slug: {slug}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TextHeader text="Other Destinations" size="small" align="left" />
              <div className="space-y-4 mt-4">
                {destinations
                  .filter((item) => item.slug !== slug)
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
                        <h3 className="text-lg font-medium text-gray-600">
                          {item.subtitle}
                        </h3>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
