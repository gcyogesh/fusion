  
import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import MidNavbar from "@/components/organisms/MidNavBar";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";
import Image from "next/image";
import UserForm from "@/components/organisms/Userform";
import DepartureCalendar from "@/components/organisms/DepartureCalender";
import ItinerarySection from "@/components/molecules/ItinerarySection";
import Breadcrumb from "@/components/atoms/breadcrumb";
import FAQAccordion from "@/components/organisms/faq";
import Link from "next/link";
import TestimonialList from "@/components/organisms/testimonial/testimonialList";


const trekTabs = [
  "Overview",
  "Itinerary",
  "Includes/Excludes",
  "Trip Map",
  "Book Now",
  "FAQs",
  "Reviews",
];

export async function generateMetadata({ params }: { params: { id: string } }) {
  const endpoint = `tour/tour-packages/${params.id}`;
  const data = await fetchAPI({ endpoint });
  const destination = data?.data;

  if (!destination) {
    return {
      title: "Not Found",
      description: "Destination page not found.",
    };
  }

  return {
    title: destination.title,
    description: destination.description,
    openGraph: {
      title: destination.title,
      description: destination.description,
      images: [destination.gallery?.[0] || ""],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const endpoint = `tour/tour-packages/${params.id}`;
  const response = await fetchAPI({ endpoint });
  const destination = response?.data;
const testimonials = await fetchAPI({ endpoint: "testimonials" });
const testimonialData = testimonials?.data || [];
   

  if (!destination) notFound();

  const itinerary = destination.itinerary || [];
  const gallery = destination.gallery || [];
  const feature = destination.feature || {};


  const featureData = [
  {
    label: "Group Size",
    value: feature?.groupSize?.min,
    icon: "/images/iterate/min.png",
  },
  {
    label: "Trip Duration",
    value: feature?.tripDuration,
    icon: "/images/iterate/Days.png",
  },
  {
    label: "Trip Difficulty",
    value: feature?.tripDifficulty,
    icon: "/images/iterate/Moderate.png",
  },
  {
    label: "Meals",
    value: feature?.meals?.join(", "),
    icon: "/images/iterate/BreakFast.png",
  },
  {
    label: "Activities",
    value: feature?.activities?.join(", "),
    icon: "/images/iterate/Trekking.png",
  },
  {
    label: "Accommodation",
    value: feature?.accommodation?.join(" / "),
    icon: "/images/iterate/Bed.png",
  },
  {
    label: "Max Altitude",
    value: feature?.maxAltitude,
    icon: "/images/iterate/meters.png",
  },
  {
    label: "Best Season",
    value: feature?.bestSeason?.join(", "),
    icon: "/images/iterate/Seasons.png",
  },
  {
    label: "Start/End Point",
    value: feature?.startEndPoint,
    icon: "/images/iterate/kathmandu.png",
  },
];


  return (
    <>
      <Breadcrumb currentnavlink="Destinations" />
      <section className="mx-auto max-w-7xl mt-5 px-4 md:px-6">
        <span className="flex items-center gap-2 text-[#7e7e7e] text-xl font-medium mb-2">
          <MapPin className="w-6 h-6" />
          {destination.location.city}
        </span>

        <TextHeader
          text={destination.description}
          align="start"
          size="large"
          width={2000}
          className="mb-4"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full">
              <ImageDisplay
                src={destination.gallery?.[0] || "/fallback.jpg"}
                variant="rectangle"
                title={destination.title}
                description={destination.description}
                className="h-[550px] w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {destination.gallery?.[1] && (
              <div className="aspect-[16/9] w-full relative">
              <ImageDisplay
                src={destination.gallery[1]}
                variant="rectangle"
                title={destination.title}
                description={destination.description}
                className="h-[265px]"
              />
            </div>
            )}
            {destination.gallery?.[2] && (
              <div className="aspect-[16/9] w-full ">
              <ImageDisplay
                src={destination.gallery[2]}
                variant="rectangle"
                title={destination.title}
                description={destination.description}
                className="h-[265px]"
              />
              </div>
            )}
          </div>
        </div>
      </section>

      <MidNavbar tabs={trekTabs}  />

      <section id="Overview" className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 max-w-4xl pr-2">
            <TextDescription text={destination.description} />
            <div className="py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-gray-500 gap-10 p-6 border rounded-xl bg-white shadow-md max-w-4xl mx-auto mt-2 ">
                 
  {featureData.map((item, index) => (
    <div key={index} className="flex items-center gap-4">
      <Image src={item.icon} alt={item.label} width={40} height={40} className="mt-1" />
      <div>
        <p className="text-2xl font-semibold text-gray-800">{item.value || "—"}</p>
        <p className="text-xl text-gray-500">{item.label}</p>
      </div>
    </div>
  ))}

  </div>
            </div>

            <div className="max-w-5xl mx-auto py-4">
              <TextHeader text={destination.title} align="left" size="large" width={855} className="mb-1" />
              <TextDescription className="mb-4" text={destination.overview} />
            </div>

            <div className="border border-[#0E334F] rounded-2xl p-6 bg-white shadow-sm mb-4">
              <TextHeader text="Trip Highlights" align="left" size="large" width={855} className="mb-2" />
              <ul className="list-disc pl-6 space-y-2 text-base text-[#535556] ">
                {destination.highlights?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
             {/* Itinerary */}
            <div id="Itinerary" className="space-y-6 py-10">
              <div className="flex flex-row gap-2">
                <Image src="/images/iterate/itenerylogo.svg" alt="Itinerary" width={40} height={2} />
                <TextHeader text={`${destination.title} Itinerary`} align="start" size="large" width={855}  />
              </div>
              <ItinerarySection itinerary={itinerary} />

              <div id="Includes-Excludes" className="w-auto md:w-[875px] h-[1px] bg-black opacity-20 mt-2 mb-6" />
            {/* iclusion& exclusions */}
              <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <InclusionExclusion title="Cost Includes" items={destination.inclusions} icon="/images/right.png" />
                <InclusionExclusion title="Cost Excludes" items={destination.exclusions} icon="/images/cross.png" />
              </div>
            </div>

           <div className="w-full max-w-4xl  py-6 mx-auto">

              <DepartureCalendar />
            </div>

            <div id="Book-Now" className="py-6">
              <UserForm />
            </div>
          {/*trips maps */}
            <div id="Trip-Map" className="py-6">
              <TextHeader text="Trek Map" align="left" size="large" width={855} className=" mb-2" />
              {destination.googleMapUrl && (
                <Image
                  src={destination.googleMapUrl}
                  alt="Google Map"
                  width={800}
                  height={600}
                  className="h-[600px] object-cover rounded-lg shadow"
                />
              )}
            </div>
{/*equipments */}
            <div className="max-w-4xl py-6">
              <TextHeader text="Trek Gallery" align="left" size="large" width={855} className="mb-2" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                  {gallery[0] && <ImageDisplay src={gallery[0]} variant="rectangle" width={840} height={290} />}
                </div>
                <div>
                  {gallery[1] && <ImageDisplay src={gallery[1]} variant="square" width={400} height={400} />}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.slice(2, 5).map((img, i) => (
                  <ImageDisplay key={i} src={img} variant="square" width={400} height={400} />
                ))}
              </div>
            </div>
            
          </div>

          

          <aside className="w-auto px-6 mb-6 md:mb-0 lg:mb-0 md:px-0 lg:px-0 ">
            <div className="sticky top-24 w-full">
              <div className="max-w-xs flex flex-col items-center rounded-xl border border-black bg-white shadow p-1 text-center space-y-3">
                <div className="bg-[#002D62] text-white p-2 h-[45px] w-[300px] text-xl font-medium rounded-xl">Best Price</div>
                <div className="flex items-center gap-4 mt-4">
                  <p className="text-gray-700 font-semibold text-xl">USD</p>
                  <p className="text-4xl font-bold text-gray-800">{destination.basePrice}</p>
                  <p className="text-sm leading-tight">
                    <span>Per</span>
                    <span>Person</span>
                  </p>
                </div>
                <hr className="border-t border-dashed border-gray-300 w-full" />
                <p className="text-base text-gray-500">
                  Price May Vary According<br />To The Group Size.
                </p>
                <div className="py-4 space-y-2 pb-4 items-center flex flex-col">
                  <Button text="Book this Trip" variant="primary" className="text-xs sm:text-sm w-[175px] h-[42px] font-semibold" />
                  <Link  href="/contact" className="w-full">
                  <Button text="Make an Enquiry" variant="secondary" className="text-xs sm:text-sm border border-black text-[#0E334F] !p-[10px] w-[175px] h-[42px] font-medium" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <div id="FAQs"><FAQAccordion /></div>
      <div></div>
      
      
    </>
  );
}

function FeatureItem({ icon, label, value }: { icon: string; label: string; value: any }) {
  return (
    <div className="flex items-center gap-4">
      <Image src={icon} alt={label} width={40} height={40} className="mt-1 w-[35] h-[35]" />
      <div>
        <p className="font-semibold">{value}</p>
        <p className="text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function InclusionExclusion({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  return (
    <div>
      <TextHeader text={title} align="left" size="large" width={855} className="mb-2" />
      <ul className="space-y-3 list-none">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <Image src={icon} alt="icon" width={20} height={20} className="w-[35] h-[35]"/>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
