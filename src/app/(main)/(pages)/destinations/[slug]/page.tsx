import { fetchAPI } from "@/utils/apiService";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import Link from "next/link";
import Image from "next/image";

interface Destination {
  _id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  imageUrls?: string[];
  slug: string;
}

interface TourPackage {
  _id: string;
  title: string;
  description: string;
  overview: string;
  location: {
    city: string;
    country: string;
  };
  basePrice: number;
  currency: string;
  gallery: string;
  duration: {
    days: number;
    nights: number;
  };
  imageUrls?: string[];
}


interface Params {
  params: { slug: string };
}

export default async function Page({ params }: Params) {
  const { slug } = params;

  // Step 1: Fetch destination by slug with related packages
  const destinationResponse = await fetchAPI({
    endpoint: `destinations/${slug}`,
  }) as {
    data: {
      destination: Destination;
      relatedPackages: { _id: string }[];
    };
  };

  const destination = destinationResponse?.data?.destination;
  const relatedPackageIds = destinationResponse?.data?.relatedPackages || [];

  // Step 2: Fetch related packages using their IDs
  const relatedPackages: TourPackage[] = await Promise.all(
    relatedPackageIds.map(async (pkg) => {
      const res = await fetchAPI({
        endpoint: `tour/tour-packages/${pkg._id}`,
      }) as { data: TourPackage };

      return res.data;
    })
  );

  // Step 3: Fetch hero banner
  const herodata = await fetchAPI({ endpoint: "herobanner/destinations" });

   const destinationData = await fetchAPI({ endpoint: "destinations" });
  const destinations: Destination[] = destinationData?.data || [];

console.log("hello1", destination);
console.log("hello2", relatedPackages);

  return (
    <>
    <Breadcrumb currentnavlink={`Destination / ${destination?.title  || "Destination"}`} />
      
      <HeroBanner herodata={herodata?.data || []} />

      <section className="max-w-7xl mx-auto px-4">
        <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
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
                  {destination.description && (
                    <TextDescription text={destination.description} className="line-clamp-3" />
                  )}
                </div>

                {/* Related Packages */}
   
              </div>
            ) : (
              <div className="text-red-600 text-lg">
                No destination found for slug: {slug}
              </div>
            )}
          </div>

          {/* Right Column: Other Destinations */}
            <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TextHeader text="Other Destinations" size="small" align="left" />
              <div className="space-y-4 mt-4">
                {destinations
                  .filter((item) => item.slug !== slug)
                  .slice(0, 3)
                  .map((item) => (
                    <Link key={item._id} href={`/destinations/${item.slug}`}>
                      <div className="cursor-pointer">
                        <ImageDisplay
                          src={item.imageUrls?.[0]}
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

<div className="w-full h-[1.5px] bg-[#C2C2C2]" />
      
     
       <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-4 md:mt-6 ">
      {relatedPackages.map((card, index) => (
        <Link href={`/itinerary/${card._id}`} key={index} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 font-medium text-[20px] text-[#7E7E7E]">
                <Image src={"/images/Location.svg"} alt="Location" width={20} height={20} />
                {card.location?.city }, {card.location?.country}
              </span>
              <span className="flex items-center gap-2 font-medium text-[20px] text-[#7E7E7E]">
                <Image src={"/images/clock.svg"} alt="Clock" width={20} height={20} />
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

             <div className="flex flex-row  text-lg font-medium text-[#7E7E7E] text-[20px] mt-1">
        Starting Price: <span className="text-primary font-semibold ml-5">${card.basePrice}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </section>
      
    </>
  );
}
