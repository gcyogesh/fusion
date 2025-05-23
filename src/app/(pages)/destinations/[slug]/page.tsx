import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import { CiLocationOn } from "react-icons/ci";
import { notFound } from "next/navigation";
import MidNavbar from "@/components/organisms/MidNavBar";
// This sets up the <title> and <meta description> dynamically
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const endpoint = `destinations/${params.slug}`;
  const data = await fetchAPI({ endpoint });
  const destinationdata = data?.data;

  if (!destinationdata) {
    return {
      title: "Not Found",
      description: "Destination page not found.",
    };
  }

  return {
    title: destinationdata.title,
    description: destinationdata.subtitle,
    openGraph: {
      title: destinationdata.title,
      description: destinationdata.subtitle,
      images: [destinationdata.imageUrl],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const endpoint = `destinations/${params.slug}`;
  const data = await fetchAPI({ endpoint });
  const destinationdata = data?.data;

  if (!destinationdata) {
    notFound();
  }

  return (
 
    <>
       <section>
      <div className="mx-auto max-w-7xl py-16">
        <span className="flex items-center gap-1">
          <CiLocationOn className="w-5 h-5" />
          {destinationdata.location}
        </span>
 
        <TextHeader text={destinationdata?.subtitle} align="start" width={'100%'} />

        <div className="grid grid-cols-1 lg:grid-cols-3   gap-4">
          <div className="lg:col-span-2 flex flex-col">
            <div className="aspect-video w-full">
              <ImageDisplay
                src={destinationdata?.imageUrl}
                variant="rectangle"
                title={destinationdata?.title}
                description={destinationdata?.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <MidNavbar/>
    
    </>
  );
}
