import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import Breadcrumb from "@/components/atoms/breadcrumb";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";

interface Destination {
  _id: string;
  title: string;
  subtitle: string;
  imageUrls: string[];
  slug: string;
  totalTrips: number;
  src?: string;
}

async function DestinationPage() {
  const response = await fetchAPI<{ data: Destination[] }>({ endpoint: "destinations" });
  const destinations = response?.data || [];

  return (
    <>
      <Breadcrumb currentnavlink="Destinations" />
      <section className="max-w-7xl mx-auto px-6 py-12">
        <TextHeader
          text="Explore by Destinations"
          buttonText="Destinations"
          specialWordsIndices="2"
          size="medium"
          width={622}
          align="left"
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Link
              href={`/destinations/${destination.slug}`}
              key={destination.slug}
            >
              <ImageDisplay
                src={destination.imageUrls?.[0] || destination.src}
                variant="square"
                title={destination.title}
                description={destination.subtitle}
                totalTrips={destination.totalTrips}
                showDefaultTitle={true}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default DestinationPage;