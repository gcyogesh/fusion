import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import { CiLocationOn } from "react-icons/ci";
import { MapPin, Mountain, Utensils, BedDouble, Users, Clock, Footprints, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import MidNavbar from "@/components/organisms/MidNavBar";
import Button from "@/components/atoms/button";
import TextDescription from "@/components/atoms/description";
import Image from "next/image";
import UserForm from "@/components/organisms/Userform";
import DepartureCalendar from "@/components/organisms/DepartureCalender";

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

const itinerary = destinationdata?.[0]?.relatedPackages?.[0]?.itinerary || [];
const relatedDestination = destinationdata?.relatedPackages || [];  

console.log("Related Destinations:", relatedDestination);
console.log("Image URL:", relatedDestination?.[0]?.googleMapUrl);
console.log("Itinerary data:", itinerary);
  if (!destinationdata) {
    notFound();
  }

  return (
 
    <>
       <section >
      <div className="mx-auto max-w-7xl py-16">
        <span className="flex items-center gap-1">
          <CiLocationOn className="w-5 h-5" />
          {destinationdata.destination.location}
        </span>
 
        <TextHeader text={destinationdata?.destination.subtitle} align="start" size="large" width={2000} className="mb-4" />

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
      <div className="mx-auto max-w-7xl   flex flex-col md:flex-row lg:flex-row  justify-between gap-2 ">
        {/* Main Content */}
        <div className="flex-1 max-w-[860px]">

          {relatedDestination.map((destination) => ( 
           <TextDescription className="" text={destination.description} />
          ))} 
          
          {relatedDestination.map((destination, index) => (
         <div key={index} className="mb-4">
   
   

    {/* Features Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 border rounded-xl bg-white shadow-md max-w-4xl mx-auto">
      <div className="flex items-start gap-3">
       <Image
                src="/images/iterate/min.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.feature?.groupSize?.min}</p>
          <p className="text-sm text-gray-500">Group Size</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
         <Image
                src="/images/iterate/Days.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.tripDuration}</p>
          <p className="text-sm text-gray-500">Trip Duration</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/Moderate.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.tripDifficulty}</p>
          <p className="text-sm text-gray-500">Trip Difficulty</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/BreakFast.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.meals?.join(", ")}</p>
          <p className="text-sm text-gray-500">Meals</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/Trekking.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.activities?.join(", ")}</p>
          <p className="text-sm text-gray-500">Activities</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/Bed.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.accommodation?.join(" / ")}</p>
          <p className="text-sm text-gray-500">Accommodation</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/meters.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.maxAltitude}</p>
          <p className="text-sm text-gray-500">Max Altitude</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/Seasons.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.bestSeason?.join(", ")}</p>
          <p className="text-sm text-gray-500">Best Season</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Image
                src="/images/iterate/kathmandu.png"
                alt="Included"
                width={30}
                height={30}
                className="mt-1"
              />
        <div>
          <p className="font-semibold">{destination.startEndPoint}</p>
          <p className="text-sm text-gray-500">Start/End Point</p>
        </div>
      </div>
    </div>
  </div>
))}


          <section>
             <div>
             
          {relatedDestination.map((destination) => (
            <div key={destination.title}>
              <TextHeader text={destination.title} align="left" size="large" width={855} className=" w-[815px] h-auto mb-2" />
              <TextDescription className="mb-4" text={destination.overview} />
            </div>
          ))} 

              </div>

            <div className="border border-gray-300 rounded-md p-6 bg-white shadow-sm mb-4">
            <TextHeader text="Trip Highlights" align="left" size="large" width={855} className=" w-[815px] h-auto mb-2" />
            
            <ul className="list-disc list-inside text-base text-[#535556] space-y-2 pl-2">
              {relatedDestination[0]?.highlights?.map((trips , index) => (
      <li key={index}>{trips}</li>
              ))}

            </ul>
          </div>
          
</section>

        </div>

        {/* Sidebar */}
        <div className="w-auto  ">
          <div className=" sticky top-24 w-[327px] ">
            {/* Related Blogs */}
            <div className="max-w-xs rounded-xl border border-black bg-[#ffff] shadow p-6 text-center space-y-4">
      <div className="bg-[#002D62] text-white text-base font-medium py-2 rounded-xl">
        Best Price
      </div>
      <div>
        <p className="text-gray-700 text-sm">USD</p>
        <p className="text-4xl font-bold text-gray-800">250</p>
        <p className="text-sm text-gray-700">Per Person</p>
      </div>
      <hr className="border-dashed border-gray-300" />
      <p className="text-xs text-gray-500">Price May Vary According<br />To The Group Size.</p>
      <div className="space-y-3 ml-12">
        <Button text=" Book this Trip" variant="primary" className="text-xs flex  sm:text-sm " />
        <Button text=" Make in Enquiry" variant="secondary" className="text-xs flex  sm:text-sm " />
       
      </div>
    </div>
            
            
          </div>
        </div>
      </div>

      
<section className="mx-auto max-w-7xl py-16">
{/* 
   <TextHeader
    text="ABC Trek Itinerary"
    align="left"
    size="large"
    width={855}
    className="w-[815px] h-auto mb-2"
  />
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {itinerary.map((item, i) => (
      <ItineraryCard
        key={i}
        title={`Day ${item.day}: ${item.title}`}
        description={item.description}
        image={item.image}
      />
    ))}
  </div> 

  </div> */}

  <div className=" max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cost Includes */}
      <div>
        <TextHeader
          text="ABC Trek Cost Includes"
          align="left"
          size="large"
          width={855}
          className="w-[815px] h-auto mb-2"
        />

        <ul className="space-y-3 list-none">
          {relatedDestination[0].inclusions.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <Image
                src="/images/right.png"
                alt="Included"
                width={20}
                height={20}
                className="mt-1"
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
          className="w-[815px] h-auto mb-2"
        />

        <ul className="space-y-3 list-none">
          {relatedDestination[0].exclusions.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <Image
                src="/images/cross.png"
                alt="Excluded"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
 
</section>


     <section  className=" mx-auto  max-w-7xl py-16 ">
       < DepartureCalendar />
      </section>

      <section  className=" mx-auto max-w-7xl py-16">
       < UserForm />
      </section>

 <section className="mx-auto max-w-7xl py-16">
  <TextHeader
    text="ABC Trek Gallery"
    align="left"
    size="large"
    width={855}
    className="w-[815px] h-auto mb-6"
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

</section>

      
    <section className="mx-auto max-w-7xl py-16">
  <TextHeader
    text="ABC Trek Map"
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
          height={430}
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
          height={430}
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
</section>


      
    </section>
    {/* <section>
{
<div className="mx-auto max-w-7xl">

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



   <section>
  <TextHeader text="Related Destinations" align="start" width={2000} />
  <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
    {relatedDestination.map((destination, index) => (
     <TextHeader
        key={index}
        text={destination.title}
        align="start"
        width={2000}
        className="text-lg font-semibold mb-2"
      />
      
     

    ))}
   
   </div> 
 
</section> */}

    </>
  );
}
                                                          