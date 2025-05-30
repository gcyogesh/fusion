import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import { CiLocationOn } from "react-icons/ci";
import { notFound } from "next/navigation";
import MidNavbar from "@/components/organisms/MidNavBar";
import TextDescription from "@/components/atoms/description";
// featuresData.ts


// This sets up the <title> and <meta description> dynamically
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const endpoint = `destinations/${params.slug}`;
  const data = await fetchAPI({ endpoint });
  const destinationdata = data?.destination;

  if (!destinationdata) {
    return {
      title: "Not Found",
      description: "Destination page not found.",
    };
  }
  
  return {
    title: destinationdata.destination.title,
    description: destinationdata.destination.subtitle,
    openGraph: {
      title: destinationdata.destination.title,
      description: destinationdata.destination.subtitle,
      images: [destinationdata.imageUrl],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const endpoint = `destinations/${params.slug}`;
  const data = await fetchAPI({ endpoint });
  const destinationdata = data?.data;
5
  if (!destinationdata) {
    notFound();
  }

  return (
 
    <>
       <section>
      <div className="mx-auto max-w-7xl py-16">
        <span className="flex items-center gap-1">
          <CiLocationOn className="w-5 h-5" />
          {destinationdata.destination.location}
        </span>
 
        <TextHeader text={destinationdata?.destination.subtitle} align="start" width={2000} />

        <div className="grid grid-cols-1 lg:grid-cols-3   gap-4">
          <div className="lg:col-span-2 flex flex-col">
            <div className="aspect-video w-full">
              <ImageDisplay
                src={destinationdata?.destination.imageUrl}
                variant="rectangle"
                title={destinationdata?.destination.title}
                description={destinationdata?.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <MidNavbar/>
    <section>
{
<div className="mx-auto max-w-7xl">
  {destinationdata.relatedPackages?.map((pkg: any, idx: number) => (
    <div key={idx}>
   
  <TextDescription text={pkg.description} />
    </div>
  ))}
 <div className="max-w-5xl mx-auto p-6 border rounded-md shadow-sm bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinationdata.feature?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h4 className="text-sm font-semibold">{item.groupSize.min}</h4>
              <p className="text-xs text-gray-500">{item.tripDifficulty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
</div>

  
}
     
    </section>
    </>
  );
}
                                                          