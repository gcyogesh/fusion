
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import HeroSection from "@/components/organisms/HeroSection";
// Atom Components
import ImageDisplay from "@/components/atoms/ImageCard";
import Button from "@/components/atoms/button";
import TextHeader from "@/components/atoms/headings";
import { fetchAPI } from "@/utils/apiService";


 
import PartnerSection from "@/components/organisms/partners";




import TextDescription from "@/components/atoms/description";
import Link from "next/link";

//molecules components
import TopCategoriesSection from "@/components/molecules/TopCategoriesSection";
import ValuesSection from "@/components/molecules/ValueSection";
import { ReactNode} from "react";
import StatCard from "@/components/molecules/StatCard";
import FAQAccordion from "@/components/organisms/faq";
import TestimonialsSection from "@/components/organisms/testimonial/arrowtestimonial"
import { Destination , Activities  , TourPackages } from "@/types";
import { FaQ } from "react-icons/fa6";
const stats = [
  {
    iconSrc: "/images/stat1.png",
    title: "18+",
    subtitle: "Years of Experience",
    description: "Seasoned in travel excellence since day one.",
  },
  {
    iconSrc: "/images/stat2.png",
    title: "2750+",
    subtitle: "TripAdvisor Reviews",
    description: "Loved and trusted by thousands of travelers.",
  },
  {
    iconSrc: "/images/stat3.png",
    title: "116+",
    subtitle: "Cultural Tours",
    description: "Experience the heart of tradition and heritage with us.",
  },
  {
    iconSrc: "/images/stat4.png",
    title: "106+",
    subtitle: "Adventure Activities",
    description: "Thrills, treks, and unforgettable adrenaline rushes.",
  },
];

const journeyCards = [
  {
    src: "/images/Journey.png",
    title: "@jane87",
    variant: "smallsquare",
  },
  {
    src: "/images/Journey.png",
    title: "@jane87",
    variant: "smallsquare",
  },
  {
    src: "/images/Journey.png",
    title: "@jane87",
    variant: "smallsquare",

  },
  {
    src: "/images/Journey.png",
    title: "@jane87",
    variant: "smallsquare",
  },
];

const socialLinks = [
  { icon: <FaInstagram className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5" />, link: "#" },
  { icon: <FaFacebookF className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5 " />, link: "#" },
  { icon: <FaYoutube className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5 " />, link: "#" },
];

export default async function Home() {
  const partnersdata: any = await fetchAPI({ endpoint: "partners" });
  const blogsdata: any = await fetchAPI({ endpoint: "blogs" });
  const FaqdataRaw: any = await fetchAPI({ endpoint: "faqs" });

  const destinationdata: any = await fetchAPI({ endpoint: "destinations" });
  const packagesdata: any = await fetchAPI({ endpoint: "tour/tour-packages" });
  const activitiesdata: any = await fetchAPI({ endpoint: "category/activities" });
  // Handle possible API response shapes
  const activities: Activities = (Array.isArray(activitiesdata) ? activitiesdata : (activitiesdata?.data || [])).map((activity: any) => ({
    _id: activity._id,
    title: activity.title,
    subtitle: activity.subtitle || '',
    description: activity.description || '',
    image: activity.image || (activity.imageUrls ? activity.imageUrls[0] : ''),
    slug: activity.slug
  }));
  const testimonialRaw = await fetchAPI({ endpoint: "testimonials" });
  const testimonialData: any[] = Array.isArray(testimonialRaw) ? testimonialRaw : (testimonialRaw?.data || []);

  // Filter packages to exclude activities and destinations
  const filteredPackages = (packagesdata?.data?.tours || packagesdata?.tours || []).filter((card: any) => {
    const isActivity = card.type === 'activity' || card.category === 'activity';
    const isDestination = card.type === 'destination' || card.category === 'destination';
    return !isActivity && !isDestination;
  }) || [];

  const herosectiondata: any = await fetchAPI({ endpoint: "herobanner/home" });
    
  return (
    <>

      <HeroSection herodata={herosectiondata.data } />


      {/*Value secction */}
      < ValuesSection />

      {/*Featured Experience: destination */}

      <section className="max-w-7xl mx-auto  px-6">
        <TextHeader
          text="Where Dreams Meet Destinations"
          buttonText="Featured Experience"
          specialWordsIndices="3"
          size="medium"
          width={622}
          align="center"
          className="mb-4" // Increased spacing for better visual balance
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 "> {/* Consistent gap */}

{filteredPackages.slice(0, 3).map((card, index) => (
  <Link href={`/itinerary/${card.slug}`} key={index} className="flex flex-col gap-4">
    <div className="aspect-video ">
      <ImageDisplay
        src={card.gallery[0]}
        variant="square"
        snippet="popular"
        snippetPosition="start"
        title={card.title}
        description={card.description}
      />
    </div>

    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm ">
        <span className="flex items-center gap-1 font-medium text-[20px] text-[#7E7E7E]">
          <Image src={"/images/Location.svg"} alt="Clock" width={20} height={20}/>
          {card.location?.city}, {card.location?.country}
        </span>
        <span className="flex items-center gap-2 font-medium text-[20px]  text-[#7E7E7E]  ">
          <Image src={"/images/clock.svg"} alt="Clock" width={20} height={20}/>
          {card.duration?.days} Days
        </span>
      </div>

      <TextHeader text={card.overview} size="small" align="left" width={410}  className="line-clamp-2"/>

      <div className="w-full h-[1.5px] bg-[#C2C2C2]" />

      <div className="flex flex-row  text-lg font-medium text-[#7E7E7E] text-[20px] mt-1">
        Starting Price:  <span className="text-primary font-semibold ml-5"> ${card.basePrice}</span>
      </div>
    </div>
  </Link>
))}

        </div>
      </section>

      {/*Flight Advanture */}

      <section className="relative w-full ">
        {/* Background Image */}
        <Image
          src="/images/flight.png"
          alt="flight background"
          width={600}
          height={677}
          layout="responsive"
          className="w-full object-cover min-h-[320px] sm:min-h-[470px] md:min-h-[677px]  pb-8 sm:pt-6 "
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center ">
          <div className="w-full max-w-7xl mx-auto  py-0 md:py-6 lg:py-6">
            {/* Scale wrapper for responsiveness */}
            <div className="transform origin-top scale-[0.85] sm:scale-100">
              <div className="grid grid-cols-2 items-center  max-w-full">

                {/* Left Content */}
                <div className="text-white space-y-3 md:space-y-6 text-xs  md:text-base">
                  <div className="space-y-1 md:space-y-2 lg:space-y-3 ">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/ph_cloud-sun-duotone.svg"
                        alt="Search Icon"
                        width={40}
                        height={40}
                      />
                      <h1 className="text-white opacity-70 text-base md:text-2xl font-semibold">
                        Feel the freedom<br />in the sky
                      </h1>
                    </div>

                    <TextHeader
                      text={filteredPackages?.[3]?.title || "Pokhara Ultralight Flight Adventure"}
                      specialWordsIndices="1"
                      align="left"
                      size="medium"
                      textcolor="white"
                      className="w-[250px]  md:w-[400px] lg:w-[400px] mt-2"
                    />
                  </div>

                  <div className="w-auto md:w-[530px] h-px bg-white/30 mb-3 sm:mb-1 md:mb-3" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 w-full   mt-6 sm:mt-1 md:mt-6 ">
                    <div className="space-y-2 md:space-y-4 text-sm md:text-xl lg:text-xl ">
                      <div className="flex items-center gap-2">
                        <Image src={"/images/clocky.svg"} alt="Location" width={22} height={22}/>
                        <span>{filteredPackages?.[3]?.duration?.days ? `${filteredPackages[3].duration.days} Minutes` : "30 Minutes – 90 Minutes"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src={"/images/dollars.svg"} alt="Location" width={22} height={22}/>
                        <span className="flex items-center gap-x-2 md:gap-x-4">
                          Start From <span className="text-primary font-semibold">{filteredPackages?.[3]?.basePrice ? `$${filteredPackages[3].basePrice}` : "$120 – $250"}</span>
                        </span>

                      </div>
                    </div>

                    <div className="flex justify-start sm:justify-end items-end mr-0 md:mr-25 mt-4 md:mt-0 lg:mt-0 ">
                      <Button text="Book Now" variant="primary" className="text-base text-[#FFFFFF]"  buttonLink={filteredPackages?.[3]?._id ? `/itinerary/${filteredPackages[3]._id}` : "/itinary"} />
                    </div>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="w-full flex flex-row items-center justify-end  pl-10 md:pl-0 lg:pl-0">
                  <div className="rounded-xl shadow-md  border border-gray-400  backdrop-blur-md p-2 md:p-3 lg:p-3 ">
                    <ImageDisplay
                      src={filteredPackages?.[3]?.gallery?.[0] || "/images/pokharaflight.png"}
                      alt={filteredPackages?.[3]?.title || "Ultralight Flight"}
                      variant="smallsquare"
                      width={568}
                      height={400}
                      className="object-fill"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
     <div className="max-w-7xl mx-auto px-6 md:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 place-items-center md:place-items-start py-2 mb-4 ">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            iconSrc={stat.iconSrc}
            title={stat.title}
            subtitle={stat.subtitle}
            description={stat.description}
          />
        ))}
      </div>
   




      {/*Best destination */}

      <section className="max-w-7xl mx-auto px-6 ">
        <TextHeader
          text="Top Picks for Your Next Adventure"
          buttonText="Best Destinations"
          className="mb-5"
          specialWordsIndices="5"
          width={500}
        />

       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
 
  <div className="lg:col-span-2">
     <Link
              href={`/destinations/${destinationdata.data[0].slug}`}
              className="lg:col-span-2 block"  >
    <ImageDisplay 
      src={destinationdata.data[0].imageUrls[0]} 
      variant="rectangle" 
      width={840} 
      height={430} 
      title={destinationdata.data[0].title} 
      showDefaultTitle={true} 
      description={destinationdata.data[0].subtitle} 
      totalTrips={destinationdata.data[0].totalTrips}  
    />
    </Link>
  </div>

  
  <div>
         <Link
              href={`/destinations/${destinationdata.data[1].slug}`}
              className="lg:col-span-2 block"  >
    <ImageDisplay 
      src={destinationdata.data[1].imageUrls[0]} 
      variant="square" 
      title={destinationdata.data[1].title} 
      showDefaultTitle={true} 
      description={destinationdata.data[1].subtitle} 
      totalTrips={destinationdata.data[1].totalTrips}  // ✅ Changed to [1]'s data
    />
    </Link>
  </div>
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {destinationdata.data.slice(2, 5).map((card, index) => (
    <div key={index}>
       <Link
              href={`/destinations/${card.slug}`}
              className="lg:col-span-2 block"  >
      <ImageDisplay 
        src={card.imageUrls[0]} 
        variant="square" 
        alt="Pashpati"
        title={card.title} 
        description={card.subtitle} 
        showDefaultTitle={true}
        totalTrips={card.totalTrips}  // ✅ Uses current card's data
      />
      </Link>
    </div>
  ))}
</div>

      </section>

      {/*Tour Categories */}
      <TopCategoriesSection
        buttonText="Tour Categories"
        activities={activities}
      />


      {/* Everest Section */}
      <section className="relative z-0 max-w-7xl mx-auto mt-20 rounded-lg overflow-hidden px-6 bg-light-beige">
        {/* Background Image */}
        {/* <div className="absolute inset-0 ">
          <Image
            src="/images/EverestBG.png"
            alt="Everest Background"
            fill
            className="object-cover"
          />
        </div> */}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-4 mb-8">
          <div className="w-full max-w-3xl">

            {/* Heading */}
            <TextHeader
              text="Our Everest Base Camp Trek is loved worldwide"
              align="center"
              size="medium"
              width="92%"
              specialWordsIndices="7" // Assuming your component uses this to style "worldwide"
              className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight"
            />

            {/* Description */}
            <p className="mt-4 text-base w-[300px] md:w-[450px] mx-auto">
  Everest Base Camp Trek is a world-renowned adventure that takes you deep into the heart of the Himalayas. Experience breathtaking views.
</p>

            {/* Info Row */}
            <div className="flex flex-col sm:flex-row justify-center  gap-4 sm:gap-6 mt-6 font-semibold">
              <div className="flex items-center justify-center gap-2 text-[16px] md:text-[18px] ">
                <Image src={"/images/time.svg"} alt="Location" width={25} height={22}/>
                <span>12–14 Days</span>
              </div>
              <div className="flex items-center justify-center gap-2  text-[16px] md:text-[18px]">
                <Image src={"/images/loco.svg"} alt="Location" width={25} height={22}/>
                <h1>Everest (Khumbu), Nepal</h1>
              </div>
              <div className="flex items-center justify-center gap-2  text-[16px] md:text-[18px]">
                <Image src={"/images/treks.svg"} alt="Location" width={25} height={22}/>
                <h1 className="font-sans">Moderate to Challenging</h1>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              text="Start Your Adventure"
              variant="primary"
              className="mt-8 mx-auto text-base p-2"
              buttonLink="/activities"
            />
          </div>
        </div>
      </section>

      {/*PartnerSection*/}
      <section><PartnerSection partnersdata={partnersdata.data} /></section>

     
 <TestimonialsSection testimonialData={testimonialData} />

      {/* Share the joy of your journey */}
      <section className=" bg-[#0e334f]">
        <div className="max-w-7xl mx-auto text-white space-y-4 md:px-0 px-6 mb-12 mt-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 items-end mb-10 ">
            {/* Left Side: Header and Paragraph */}
            <div className="flex flex-col items-start space-y-2">
              <TextHeader
                text="Share the joy of your journey"
                specialWordsIndices="2"
                align="start"
                width="400px"
                textcolor="white"
              />

              <TextDescription text="Show us your #BestFamilyMoments by tagging us @Fusion Expeditions for a chance to be featured!" className="w-[300px] md:w-[400px] lg:w-[400px] text-[#FFFFFF] opacity-90" />
            </div>

            {/* Right Side: Social Links */}
            <div className="flex justify-end  space-x-3  ">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.link} className="hover:scale-110 transition-transform">
                  <span>{link.icon}</span>
                </a>
              ))}
            </div>
          </div>




          <div className=" flex flex-cols-1 gap-2 m-2 md:gap-6 lg:gap-6 ">

            {journeyCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center  ">
                <ImageDisplay
                  src={card.src}
                  variant="smallsquare"
                  secondSnippet={
                    <TextHeader
                      text={card.title}
                      size="small"
                      align="end"
                      className="md:show hidden"
                      textcolor="white"
                    />
                  }
                />
              </div>

            ))}

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 ">
        <TextHeader
          text="Adventure Awaits: Travel Stories & Tips"
          buttonText="From the Blogs"
          className="mb-8"
          type="main"
          specialWordsIndices="2"
          width={500}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Large Blog Post */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href={`/blogs/${blogsdata.data[0].slug}`}  >
              <div className="aspect-video w-full">
                <ImageDisplay src={blogsdata.data[0].imageUrl}  variant="rectangle" title={blogsdata.data[0].title}
                  description={blogsdata.data[0].subtitle} createdAt={blogsdata.data[0].createdAt} />
              </div>
              <div className="mt-3">
                <TextHeader size="small" text={String(blogsdata.data[0].subtitle)} align="left" />
                
               <TextDescription text={blogsdata.data[0].description} className="text-justify line-clamp-4" />
              
                
              </div>
            </Link>
          </div>

          {/* Right Side: Two Small Blog Posts */}
          <div className="flex flex-col ">
            {blogsdata.data.slice(1, 3).map((card: {
              slug: any;
              subtitle: ReactNode; id: string; imageUrl: string; title: string; description: string
            }) => (
              <>
                <Link href={`/blogs/${card.slug}`} key={card.id} >
                  <div key={card.id} className="flex flex-col">
                    <div className="">

                      <ImageDisplay src={card.imageUrl} variant="smallrectangle" title={card.title} description={card.description} createdAt={blogsdata.data[0].createdAt} />
                    </div>
                    <div className="mt-4 h-[150px] ">
                      <TextHeader size="small" text={String(card.subtitle)} align="left" />
                      <TextDescription text={card.description} className=" line-clamp-3 " />
                    </div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </section>

<section className="max-w-7xl mx-auto flex flex-col md:flex-row lg:flex-row gap-10 px-4 " > 
  <TextHeader
        text="Need Help? We've Got Answers!"
        specialWordsIndices="4"
        align="left"
        size="medium"
        width="500px"
        buttonText="FAQ"
      />
  <FAQAccordion faqdata={FaqdataRaw}/>
  </section>
    



    </>
  );
}

