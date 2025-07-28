import { fetchAPI } from '@/utils/apiService';
import Breadcrumb from '@/components/atoms/breadcrumb';

import { APIResponse, TourPackage } from '@/types';
import TextHeader from '@/components/atoms/headings';
import ImageDisplay from '@/components/atoms/ImageCard';
import MidNavbar from '@/components/organisms/MidNavBar';
import { notFound } from 'next/navigation';
import TextDescription from '@/components/atoms/description';
import UserForm from '@/components/organisms/Userform';
import DepartureCalendar from '@/components/organisms/DepartureCalender';
import ItinerarySection from '@/components/molecules/ItinerarySection';
import FAQAccordion from '@/components/organisms/faq';

import Image from 'next/image';
import React from 'react';
import PricingCard from '@/components/atoms/pricingcard';
import ReviewSection from '@/components/organisms/testimonial/review';
import DownloadPdfButton from '@/components/atoms/pdfbutton';
const trekTabs = [
  "Overview",
  "Itinerary",
  "Pricing",
  "Route",
  "FAQs",
  "Reviews"
];

export async function generateMetadata({ params }: { params: { id: string } }) {
  const endpoint = `tour/tour-packages/${params.id}`;
  const data = await fetchAPI<TourPackage>({ endpoint });
  const packages = data?.data;


  if (!packages) {
    return {
      title: "Not Found",
      description: "packages page not found.",
    };
  }

  return {
    title: packages.title,
    description: packages.description,
    openGraph: {
      title: packages.title,
      description: packages.description,
      images: [packages.gallery?.[0] || ""],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const endpoint = `tour/tour-packages/${params.id}`;
  const response = await fetchAPI<TourPackage>({ endpoint });
  const packages = response?.data;

  if (!packages) notFound();




  const featureData = [
    {
      label: "Group Size",
      value: packages.feature?.groupSize?.min,
      icon: "/images/iterate/min.png",
    },
    {
      label: "Trip Duration",
      value: packages.feature?.tripDuration,
      icon: "/images/iterate/Days.png",
    },
    {
      label: "Trip Difficulty",
      value: packages.feature?.tripDifficulty,
      icon: "/images/iterate/Moderate.png",
    },
    {
      label: "Meals",
      value: packages.feature?.meals?.join(", "),
      icon: "/images/iterate/BreakFast.png",
    },
    {
      label: "Activities",
      value: packages.feature?.activities?.join(", "),
      icon: "/images/iterate/Trekking.png",
    },
    {
      label: "Accommodation",
      value: packages.feature?.accommodation?.join(" / "),
      icon: "/images/iterate/Bed.png",
    },
    {
      label: "Max Altitude",
      value: packages.feature?.maxAltitude,
      icon: "/images/iterate/meters.png",
    },
    {
      label: "Best Season",
      value: packages.feature?.bestSeason?.join(", "),
      icon: "/images/iterate/Seasons.png",
    },
    {
      label: "Start/End Point",
      value: packages.feature?.startEndPoint,
      icon: "/images/iterate/kathmandu.png",
    },
  ];

  return (
    <>
      <Breadcrumb currentnavlink={`Destination/ ${packages?.title || "Destination"}`} />
      <section className="mx-auto max-w-7xl mt-5 px-4 md:px-6">

        {/* Mobile View - Single image with horizontal scroll */}
        <div className="block lg:hidden mb-4 mt-10">
          <div className="overflow-x-auto">
            <div className="flex gap-4 " style={{ width: 'max-content' }}>
              {packages.gallery?.map((img, i) => (
                <div key={i} className="flex-shrink-0">
                  <ImageDisplay
                    src={img}
                    variant="rectangle"
                    title={packages.title}
                    description={packages.description}
                    className="h-[300px] w-[400px]"
                    showOverlayText={false}
                    showArrowIcon={false}
                    showImagePopup={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Original grid layout */}
        <div className="hidden lg:block mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="aspect-video w-full">
                <ImageDisplay
                  src={packages.gallery?.[0] || "/fallback.jpg"}
                  title={packages.title}
                  description={packages.description}
                  className="h-[550px] w-full"
                  showOverlayText={false}
                  showArrowIcon={false}
                  showImagePopup={true}
                />
              </div>

            </div>
            <div className="flex flex-col gap-4">
              {packages.gallery?.[1] && (
                <div className="aspect-[16/9] w-full relative">
                  <ImageDisplay
                    src={packages.gallery[1]}
                    variant="rectangle"
                    title={packages.title}
                    description={packages.description}
                    className="h-[265px]"
                    showOverlayText={false}
                    showArrowIcon={false}
                    showImagePopup={true}
                  />
                </div>
              )}
              {packages.gallery?.[2] && (
                <div className="aspect-[16/9] w-full">
                  <ImageDisplay
                    src={packages.gallery[2]}
                    variant="rectangle"
                    title={packages.title}
                    description={packages.description}
                    className="h-[265px]"
                    showOverlayText={false}
                    showArrowIcon={false}
                    showImagePopup={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <MidNavbar tabs={trekTabs} />

      <section id="Overview" className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 max-w-4xl pr-2">

            <div className="max-w-5xl mx-auto py-4">
              <TextHeader text={packages.title} align="left" size="large" width={855} className="mb-1" />
              <TextDescription className="mb-4" text={packages.overview} />
            </div>


            <FeatureGrid featureData={featureData} />


            <div className="rounded-2xl p-6 bg-white shadow-sm mb-4 py-2">
              <TextHeader text="Trip Highlights" align="left" size="large" width={855} className="py-2" />
              <ul className="list-disc pl-6 space-y-2 text-base text-[#535556] ">
                {packages.highlights?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

{/* {packages.quickfacts && packages.quickfacts?.length > 0 && (
             <div className="rounded-2xl p-6 bg-white shadow-sm mb-4 py-2">
              <TextHeader text="Quick Facts" align="left" size="large" width={855} className="py-2" />
              <ul className="list-disc pl-6 space-y-2 text-base text-[#535556] ">
                {packages.quickfacts?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
)} */}


            {/* Itinerary */}
            <div className="space-y-6 py-10">

              <div className="flex flex-row gap-2">
                <Image src="/images/iterate/itenerylogo.svg" alt="Itinerary" width={40} height={2} />
                <TextHeader text={`${packages.title} Itinerary`} align="start" size="large" width={855} />
              </div>
              <div id="Itinerary"><ItinerarySection itinerary={packages.itinerary} /></div>

              <div id="Includes-Excludes" className="w-auto md:w-[875px] h-[1px] bg-black opacity-20 mt-2 mb-6" />
              {/* iclusion& exclusions */}
              <div className="max-w-4xl grid grid-cols-1 gap-8">
                <InclusionExclusion title="Cost Includes" items={packages.inclusions} icon="/images/right.png" />
                <InclusionExclusion title="Cost Excludes" items={packages.exclusions} icon="/images/cross.png" />
              </div>
            </div>

            <div className="w-full max-w-xl  py-6 ">
              <DepartureCalendar />
            </div>


            <div className=" py-6" id="Book-Now">
              <UserForm
                availableBookingDates={["2024-07-01", "2024-07-10", "2024-07-15"]}
              />
            </div>
            {/*trips maps */}
            <div id="Route" className="max-w-7xl py-6">
              <TextHeader text=" Route" align="left" size="large" width={855} className=" mb-2" />
              {packages.googleMapUrl && (
                <Image
                  src={packages.googleMapUrl}
                  alt="Google Map"
                  width={800}
                  height={400}
                  className=" object-cover rounded-lg shadow"
                />
              )}
            </div>
            {/*equipments */}
            <div className="max-w-4xl py-6">
              <TextHeader text="" align="left" size="large" width={855} className="mb-2" />



              {/* Desktop View - Original grid layout */}
              {/* <div className="hidden lg:block">
    <div className="grid grid-cols-3 gap-4 ">
      <div className="col-span-2">
         {packages.gallery[0] && (
          <ImageDisplay 
            src={packages.gallery[0]} 
            variant="rectangle" 
            width={840} 
            height={290} 
            showOverlayText={false}
            showArrowIcon={false}
            showImagePopup={true}
          />
        )} 
      </div>
      <div>
         {packages.gallery[1] && (
          <ImageDisplay 
           src={packages.gallery[1]} 
          variant="square" 
          width={400} 
          height={400} 
          showOverlayText={false}
          showArrowIcon={false}
          showImagePopup={true}
          />
        )} 
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
       {packages.gallery.slice(2, 5).map((img, i) => (
        <ImageDisplay 
          key={i} 
          src={img} 
          variant="square" 
          width={400} 
          height={400} 
          showOverlayText={false}
          showArrowIcon={false}
          showImagePopup={true}
        />
      ))} 
    </div>
  </div> */}
            </div>


            <div id="Reviews" className="w-full max-w-7xl ">
              <ReviewSection tourId={params.id} />
            </div>
          </div>



          <aside className="w-full md:w-auto md:px-0 lg:px-0">
            {/* Mobile Sticky Footer */}
            <div className="block md:hidden fixed bottom-14 right-2 shadow-md z-50">
              <div className="max-w-md mx-auto p-2">
                <PricingCard basePrice={packages.basePrice} isCompact />
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-24 w-full">
              <PricingCard basePrice={packages.basePrice} />
              <div className="mt-5">
                <DownloadPdfButton packageId={packages._id} />
              </div>
            </div>
          </aside>

        </div>
      </section>


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
            <Image src={icon} alt="icon" width={20} height={20} className="w-[35] h-[35]" />
            <span className=" hyphens-auto text-justify">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


function FeatureGrid({ featureData }: { featureData: any[] }) {
  return (
    <div className="py-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureData.map((item, index) => (
            <FeatureItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}