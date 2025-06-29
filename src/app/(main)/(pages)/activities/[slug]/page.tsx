import { fetchAPI } from "@/utils/apiService";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";

interface Activity {
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

  const herosectiondata = await fetchAPI({ endpoint: "herobanner/activities" });
  const activitiesdata = await fetchAPI({ endpoint: "activities" });

  const activities: Activity[] = activitiesdata?.data || [];

  const activity: Activity | undefined = activities.find((item) => item.slug === slug);
  

  // Debug logs
  console.log("Slug param:", slug);
  console.log("Activity found:", activity);

  return (
    <>
      <Breadcrumb currentnavlink={activity?.title || "Activity"} />
      <HeroBanner herodata={herosectiondata?.data || []} />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {activity ? (
              <div className="flex flex-col">
                <ImageDisplay src={activity.image} variant="smallrectangle" />
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
              <TextHeader text="Other Tour Categories" size="small" align="left" />
              <div className="space-y-4 mt-4">
                {activities
                  .filter((item) => item.slug !== slug)
                  .map((item) => (
                    <div key={item._id}>
                      <ImageDisplay src={item.image} variant="smallrectangle" />
                                 <TextHeader text={activity.title} size="small" align="left" className="mt-2" />
                  <h3 className="text-lg font-medium text-gray-600">{activity.subtitle}</h3>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      <section>
        <div className="max-w-7xl mx-auto   ">
            <TextHeader text="Related Packages" align="left" />
        </div>

      </section>
    </>
  );
}
