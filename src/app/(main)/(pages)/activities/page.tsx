import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import ImageDisplay from "@/components/atoms/ImageCard";
import Link from "next/link";
export default async function ActivitiesPage() {
  const activities = await fetchAPI({ endpoint: "activities" });
  const activitiesData = activities?.data || [];

  const herodata = await fetchAPI({ endpoint: "herobanner/activities" });

  // Use the first activity's title as the heading, fallback to static text
  const heading = activitiesData[0]?.title || "Unforgettable Experiences Await";

  return (
    <>
      <Breadcrumb currentnavlink={"activities"} />
      <HeroBanner herodata={herodata?.data || []} />

      <section className="max-w-7xl mx-auto px-4">

        {/* First Row: Rectangle + Square */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {activitiesData[0] && (
            <div className="lg:col-span-2">
              <Link
              href={`/activities/${activitiesData[0].slug}`}
              className="lg:col-span-2 block"
            >
              <ImageDisplay
                src={activitiesData[0].imageUrls?.[0] || activitiesData[0].image}
                variant="rectangle"
                width={840}
                height={430}
                title={activitiesData[0].title}
                description={activitiesData[0].subtitle}
              />
              </Link>
            </div>
          )}

          {activitiesData[1] && (
            <div>
                  <Link
              href={`/activities/${activitiesData[1].slug}`}
              className="lg:col-span-2 block"
            >
              <ImageDisplay
                src={activitiesData[1].imageUrls?.[0] || activitiesData[1].image}
                variant="square"
                title={activitiesData[1].title}
                description={activitiesData[1].subtitle}
              />
              </Link>
            </div>
          )}
        </div>

        {/* Second Row: 3 Square Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activitiesData.slice(2, 5).map((card, index) => (
            <div key={index}>
                <Link
              href={`/activities/${card.slug}`}
              className="lg:col-span-2 block"
            >
              <ImageDisplay
                src={card?.imageUrls?.[0] || card?.image}
                variant="square"
                alt="Popular activity"
                snippet="popular"
                title={card?.title || "Untitled"}
                description={card.subtitle}
              />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
