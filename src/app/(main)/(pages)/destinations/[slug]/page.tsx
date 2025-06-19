import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import { MapPin } from 'lucide-react';

import { notFound } from "next/navigation";
import MidNavbar from "@/components/organisms/MidNavBar";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";
import Image from "next/image";
import UserForm from "@/components/organisms/Userform";
import DepartureCalendar from "@/components/organisms/DepartureCalender";
import ItinerarySection from "@/components/molecules/ItinerarySection";
import Breadcrumb from "@/components/atoms/breadcrumb";
// featuresData.ts


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
    title: destinationdata.destination.subtitle,
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

  const itinerary = destinationdata?.relatedPackages?.[0]?.itinerary || [];
  const relatedDestination = destinationdata?.relatedPackages || [];

  console.log("Related Destinations:", relatedDestination);
  console.log("Image URL:", relatedDestination?.[0]?.googleMapUrl);
  console.log("Itinerary data:", itinerary);
  if (!destinationdata) {
    notFound();
  }

  return (

    <>
     <Breadcrumb currentnavlink="Destinations" />
      <section className="mx-auto max-w-7xl mt-5 ">

        
          <span className="flex items-center gap-2 text-[#7e7e7e] text-xl font-medium mb-2">
          <MapPin className="w-6 h-6"/>
  {destinationdata.destination.location}
</span>

          <TextHeader text={destinationdata?.destination.subtitle} align="start" size="large" width={2000} className="mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left side large image */}
            <div className="lg:col-span-2">
              <div className="aspect-video w-full">
                <ImageDisplay
                  src={destinationdata?.destination.imageUrls?.[0] || "/fallback.jpg"}
                  variant="rectangle"
                  title={destinationdata?.destination.title}
                  description={destinationdata?.destination.subtitle}
                  className="h-[550px] w-full"
                />
              </div>
            </div>

            {/* Right side two stacked images */}
            <div className="flex flex-col gap-4">
              {destinationdata?.destination.imageUrls?.[1] && (
                <div className="aspect-[16/9] w-full relative">
                  <ImageDisplay
                    src={destinationdata.destination.imageUrls[1]}
                    variant="rectangle"
                    title={destinationdata.destination.title}
                    description={destinationdata.destination.subtitle}
                    className="h-[265px]"
                  />

                </div>
              )}

              {destinationdata?.destination.imageUrls?.[2] && (
                <div className="aspect-[16/9] w-full ">
                  <ImageDisplay
                    src={destinationdata.destination.imageUrls[2]}
                    variant="rectangle"
                    title={destinationdata.destination.title}
                    description={destinationdata.destination.subtitle}
                    className="h-[265px]"
                  />
                </div>
              )}
            </div>
          </div>

      



      </section>
      <MidNavbar />

      <section className="mx-auto max-w-7xl ">
        {/* main column and side bar */}
        <div className="flex flex-row  justify-between  ">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl  pr-2 ">
            {relatedDestination.map((destination) => (
              <TextDescription className="" text={destination.description} />
            ))}
          <div className="py-2">
            {relatedDestination.map((destination, index) => (
              <div key={index} className="mb-4 text-xl ">

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-10 p-6 border rounded-xl bg-white shadow-md max-w-4xl mx-auto mt-2 ">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/min.png"
                      alt="Included"
                      width={40}
                      height={50}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold ">{destination.feature?.groupSize?.min}</p>
                      <p className=" text-gray-500">Group Size</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/Days.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.tripDuration}</p>
                      <p className=" text-gray-500">Trip Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/Moderate.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.tripDifficulty}</p>
                      <p className=" text-gray-500">Trip Difficulty</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/BreakFast.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.meals?.join(", ")}</p>
                      <p className=" text-gray-500">Meals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/Trekking.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.activities?.join(", ")}</p>
                      <p className=" text-gray-500">Activities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/Bed.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.accommodation?.join(" / ")}</p>
                      <p className=" text-gray-500">Accommodation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/meters.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.maxAltitude}</p>
                      <p className=" text-gray-500">Max Altitude</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/Seasons.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.bestSeason?.join(", ")}</p>
                      <p className=" text-gray-500">Best Season</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/iterate/kathmandu.png"
                      alt="Included"
                      width={40}
                      height={40}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{destination.feature?.startEndPoint}</p>
                      <p className=" text-gray-500">Start/End Point</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

              </div>
        
              <div className="max-w-5xl mx-auto py-4">

                {relatedDestination.map((destination) => (
                  <div key={destination.title}>
                    <TextHeader text={destination.title} align="left" size="large" width={855} className=" w-[815px] h-auto mb-2" />
                    <TextDescription className="mb-4" text={destination.overview} />
                  </div>
                ))}

              </div>



              <div className="border border-[#0E334F]  rounded-2xl p-6 bg-white shadow-sm mb-4">
                <TextHeader text="Trip Highlights" align="left" size="large" width={855} className=" w-[815px] h-auto mb-2" />

                <ul className="list-disc list-outside text-base text-[#535556] space-y-2  pl-6">
                  {relatedDestination[0]?.highlights?.map((trips, index) => (
                    <li key={index}>{trips}</li>
                  ))}

                </ul>
              </div>

           
            <div className="space-y-6 py-10">
              <div className="flex flex-row gap-2 ">
                <Image
                  src="/images/iterate/itenerylogo.svg"
                  alt="Itinerary logo"
                  width={40}
                  height={2}
                  
                />
                <TextHeader text="ABC Trek Itinerary" align="start" size="large" width={855} />
              </div>
              <ItinerarySection itinerary={itinerary} />

              <div className={`w-auto md:w-[875px] h-[1px] bg-black opacity-20  mt-2 mb-6`} />


              <div className=" max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cost Includes */}
                <div>
                  <TextHeader
                    text="ABC Trek Cost Includes"
                    align="left"
                    size="large"
                    width={855}
                    className="w-[200px] h-auto mb-2"
                  />

                  <ul className="space-y-3 list-none">
                    {relatedDestination[0].inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Image
                          src="/images/right.png"
                          alt="Included"
                          width={20}
                          height={20}
                          className="w-[35] h-[35]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost Excludes */}
                <div>
                  <TextHeader
                    text="ABC Trek Cost Excludes"
                    align="left"
                    size="large"
                    width={855}
                    className="w-[206px] h-auto mb-2"
                  />

                  <ul className="space-y-3 list-none">
                    {relatedDestination[0].exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Image
                          src="/images/cross.png"
                          alt="Excluded"
                          width={20}
                          height={20}
                          className="w-[35] h-[35]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>


            <div className="w-4xl py-6">
              < DepartureCalendar />
            </div>

            <div className="py-6">
              < UserForm />
            </div>

            <div className="py-6">

              <TextHeader
                text="ABC Trek Map"
                align="left"
                size="large"
                width={855}
                className="w-[815px] h-auto mb-2"
              />
              {relatedDestination?.[0]?.googleMapUrl && (
                <Image
                  src={relatedDestination[0].googleMapUrl}
                  alt="Google Map Preview"
                  width={800}
                  height={600}
                  className=" h-[600px] object-cover rounded-lg shadow"
                />
              )}

            </div>


        
              <div className="max-w-4xl py-6 ">
                <TextHeader
                  text="ABC Trek Gallery"
                  align="left"
                  size="large"
                  width={855}
                  className="w-[815px] h-auto mb-2"
                />

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                  {/* Large Rectangle Image - spans 2 columns */}
                  <div className="lg:col-span-2">
                    {relatedDestination[0]?.gallery?.[0] && (
                      <ImageDisplay
                        src={relatedDestination[0].gallery[0]}
                        variant="rectangle"
                        width={840}
                        height={290}
                      />
                    )}
                  </div>

                  {/* Right Square Image (top right corner) */}
                  <div>
                    {relatedDestination[0]?.gallery?.[1] && (
                      <ImageDisplay
                        src={relatedDestination[0].gallery[1]}
                        variant="square"
                        width={400}
                        height={400}
                      />
                    )}
                  </div>
                </div>

                {/* Bottom 3 Square Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedDestination[0]?.gallery?.slice(2, 5).map((img, i) => (
                    <ImageDisplay
                      key={`bottom-${i}`}
                      src={img}
                      variant="square"
                      width={400}
                      height={400}
                    />
                  ))}
                </div>
              </div>
            

          </div>

          {/* Sidebar */}
          <div className="w-auto  ">
            <div className=" sticky top-24 w-full ">
              {/* Related Blogs */}
              <div className="max-w-xs flex flex-col items-center rounded-xl border border-black bg-[#ffff] shadow p-1 text-center space-y-3">
                <div className="bg-[#002D62] text-white p-2 h-[45px] w-[300px] text-xl font-medium rounded-xl ">
                  Best Price
                </div>

                <div className="flex flex-row  items-center gap-4 mt-[15px] ">
                  <p className="text-gray-700 font-semibold text-xl">USD</p>
                  <p className="text-4xl font-bold text-gray-800">250</p>
                  <p className="text-base flex flex-col items-start leading-tight ">
                    <span>Per</span>
                    <span>Person</span>
                   </p>
                </div>
                <hr className="border-t border-dashed border-gray-300 w-full" />
                 <p className="text-base text-gray-500">Price May Vary According<br />To The Group Size.</p>


               <div className="py-4 space-y-2 pb-4  items-center flex flex-col">
  <Button 
    text="Book this Trip" 
    variant="primary" 
    className="text-xs sm:text-sm w-[175px] h-[42px] font-semibold" 
  />
  <Button 
    text="Make an Enquiry" 
    variant="secondary" 
    className="text-xs sm:text-sm border border-black text-[#0E334F] !p-[10px] w-[175px] h-[42px] font-medium" 
  />
</div>
              </div>


            </div>
          </div>
        </div>
      </section>
    </>
  );
}
