import { fetchAPI } from "@/utils/apiService";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";

interface Activity {
  [x: string]: unknown;
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
}

interface Params {
  params: { slug: string };
}

export default async function Page({ params }: Params) {
  const { slug } = params;

  
  const activitiesdata = await fetchAPI({ endpoint: "destinations" });

  const activities: Activity[] = activitiesdata?.data || [];
  console.log("activity:",activitiesdata);

  const activity: Activity | undefined = activities.find((item) => item.slug === slug);

  // Debug logs
  console.log("Slug param:", slug);
  console.log("Activity found:", activity);

  // Fetch all packages
  const packagesData = await fetchAPI({ endpoint: "tour/tour-packages" });
  const packages = packagesData?.data || [];

  // Filter packages by destination._id (assuming field is destinationId)
  const relatedPackages = activity
    ? packages.filter((pkg) => pkg.destinationId === activity._id)
    : [];

  return (
    <>
      <Breadcrumb currentnavlink={activity?.title || "Activity"} />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {activity ? (
              <div className="flex flex-col">
                <ImageDisplay src={activity.imageUrls[0]} variant="smallrectangle" />
                <div className="mt-4">
                  <TextHeader text={activity.title} size="small" align="left" />
                  <h3 className="text-lg font-medium text-gray-600">{activity.subtitle}</h3>
                  <TextDescription text={activity.description} />
                </div>
              </div>
            ) : (
              <div className="text-red-600 text-lg">No activity found for slug: {slug}</div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TextHeader text="Other Destinations" size="small" align="left" />
              <div className="space-y-4 mt-4">
                 {activities
                  .filter((item) => item.slug !== slug)
                  .map((item) => (
                    <div key={item._id}>
                      {/* Display first image if imageUrls exist, fallback to image */}
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
                      <h3 className="text-lg font-medium text-gray-600">{item.subtitle}</h3>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show related packages */}
      <section>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Available Packages</h2>
          {activity ? (
            <a
              href={`/packages?destinationId=${activity._id}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
            >
              View Packages for this Destination
            </a>
          ) : (
            <p>No packages available for this destination.</p>
          )}
        </div>
      </section>
    </>
  );
}