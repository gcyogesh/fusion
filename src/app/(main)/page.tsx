import Image from "next/image";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { HiOutlineClock } from 'react-icons/hi';
import HeroSection from "@/components/organisms/HeroSection";
import { FaHiking } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
// Atom Components
import ImageDisplay from "@/components/atoms/ImageCard";
import Button from "@/components/atoms/button";
import TextHeader from "@/components/atoms/headings";
import { fetchAPI } from "@/utils/apiService";
 
import PartnerSection from "@/components/organisms/partners";
import { CiLocationOn } from "react-icons/ci";


import TestimonialCarousel from "@/components/organisms/testimonial/testimoinal";
import { FaTrophy, FaStar, FaGlobe } from "react-icons/fa";
import TextDescription from "@/components/atoms/description";
import Link from "next/link";
import ArrowIcon from "@/components/atoms/arrowIcon";

//molecules components
import TopCategoriesSection from "@/components/molecules/TopCategoriesSection";
import ValuesSection from "@/components/molecules/ValueSection";
import { ReactNode } from "react";



interface DestinationCard {
  _id: string;
  title: string;
  description: string;
  gallery: string[];
  location: {
    city: string;
    country: string;
  };
  duration: {
    days: number;
  };
  overview: string;
  basePrice: number;
}

interface DestinationData {
  data: DestinationCard[];
}


const stats = [
  {
    icon: <Image src="/images/stat1.png" alt="Experience Icon" width={46} height={46} className=" text-[#002B45]" />,
    title: "18+",
    subtitle: "Years of Experience",
    description: "Seasoned in travel excellence since day one.",
  },
  {
      icon: <Image src="/images/stat2.png" alt="Experience Icon" width={46} height={46} className=" text-[#002B45]" />,
    title: "2750+",
    subtitle: "TripAdvisor Reviews",
    description: "Loved and trusted by thousands of travelers.",
  },
  {
        icon: <Image src="/images/stat3.png" alt="Experience Icon" width={46} height={46} className=" text-[#002B45]" />,
    title: "116+",
    subtitle: "Cultural Tours",
    description: "Experience the heart of tradition and heritage with us.",
  },
  {
        icon: <Image src="/images/stat4.png" alt="Experience Icon" width={46} height={46} className=" text-[#002B45]" />,
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
  const partnersdata = await fetchAPI({ endpoint: "partners" });
  const blogsdata = await fetchAPI({ endpoint: "blogs" });
  const destinationdata = await fetchAPI({ endpoint: "destinations" });
    const packagesdata = await fetchAPI({ endpoint: "tour/tour-packages" });

 
  const testimoinaldata = await fetchAPI({ endpoint: "testimonials" });
  const herosectiondata = await fetchAPI({ endpoint: "herobanner/home" });
  return (
    <>

      <HeroSection herodata={herosectiondata.data} />


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

{(packagesdata as DestinationData)?.data.map((card, index) => (
  <Link href={`/itinerary/${card._id}`} key={index} className="flex flex-col gap-4">
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
      <div className="flex justify-between text-sm text-[#5A5A5A]">
        <span className="flex items-center gap-1 font-sans  leading-2">
          <Image src={"/images/location1.png"} alt="Location" width={17.5} height={25}/>
          {card.location.city}, {card.location.country}
        </span>
        <span className="flex items-center font-bold gap-1">
          <HiOutlineClock className="w-4 h-4" />
          {card.duration.days} Days
        </span>
      </div>

      <TextHeader text={card.overview} size="small" align="left" width={410}  className="line-clamp-2"/>

      <div className="w-full h-[1.5px] bg-[#C2C2C2]" />

      <div className="flex flex-row  text-lg font-semibold text-[#5A5A5A] mt-1">
        Start From <span className="text-primary ml-5">$120 - ${card.basePrice}</span>
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
                      text="Pokhara Ultralight Flight Adventure"
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
                        <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>30 Minutes – 90 Minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineCurrencyDollar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex items-center gap-x-2 md:gap-x-4">
                          Start From <span className="text-primary font-semibold">$120 – $250</span>
                        </span>

                      </div>
                    </div>

                    <div className="flex justify-start sm:justify-end items-end mr-0 md:mr-25 mt-4 md:mt-0 lg:mt-0 ">
                      <Button text="Book Now" variant="primary" className="text-base text-[#FFFFFF]"  buttonLink="/itinary" />
                    </div>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="w-full flex flex-row justify-end  pl-10 md:pl-0 lg:pl-0">
                  <div className="rounded-xl shadow-md  border border-gray-400  backdrop-blur-md p-2 md:p-3 lg:p-3 ">
                    <ImageDisplay
                      src="/images/pokharaflight.png"
                      alt="Ultralight Flight"
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

      <section>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 ">
          {stats.map((stat, index) => (
            <div key={index} className=" text-left">
              {/* Icon + Title aligned inline, flush left */}
              <div className="flex items-center space-x-2">
                {stat.icon}
                <TextHeader
                  text={stat.title}
                  size="medium"
                  align="left"
                  width="auto"
                />
              </div>

              {/* Subtitle aligned left under title */}
              <TextHeader
                text={stat.subtitle}
                size="small"
                align="left"
                width="100%"
                className="text-gray-600"
              />

              {/* Description aligned left and start from title's left */}
              <TextDescription
                text={stat.description}
                className="text-left w-[239px] "
              />
            </div>
          ))}
        </div>
      </section>




      {/*Best destination */}

      <section className="max-w-7xl mx-auto px-6 ">
        <TextHeader
          text="Top Picks for Your Next Adventure"
          buttonText="Best Destinations"
          className="mb-5"
          specialWordsIndices="5"
          width={500}
        />

        {/* First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Rectangle Image (spans 2 columns) */}
          <div className="lg:col-span-2">
            <ImageDisplay src={destinationdata.data[0].imageUrls[0]} variant="rectangle" width={840} height={430} title={destinationdata.data[0].title} description={destinationdata.data[0].subtitle} totalTrips={destinationdata.data[0].totalTrips}  />
          </div>

          {/* Square Image */}
          <div>
            <ImageDisplay src={destinationdata.data[1].imageUrls[0]} variant="square" title={destinationdata.data[1].title} description={destinationdata.data[1].subtitle} totalTrips={destinationdata.data[0].totalTrips}   />

          </div>
        </div>

        {/* Second Row with 3 Square Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinationdata.data.slice(2, 5).map((card, index) => (
            <div key={index}>
              <ImageDisplay src={card.imageUrls[0]} variant="square" alt="Pashpati"  title={card.title} description={card.subtitle}  totalTrips={destinationdata.data[0].totalTrips} />

            </div>
          ))}
        </div>

      </section>

      {/*Tour Categories */}
      <TopCategoriesSection

        buttonText="Tour Categories"
      />


      {/* Everest Section */}
      <section className="relative z-0 max-w-7xl mx-auto mt-20 rounded-lg overflow-hidden px-6">
        {/* Background Image */}
        <div className="absolute inset-0 ">
          <Image
            src="/images/EverestBG.png"
            alt="Everest Background"
            fill
            className="object-cover"
          />
        </div>

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
            <TextDescription
              text="Everest Base Camp Trek is a world-renowned adventure that takes you deep into the heart of the Himalayas. Experience breathtaking views."
              className="mt-4 text-base w-[300px] md:w-[450px]  mx-auto"
            />

            {/* Info Row */}
            <div className="flex flex-col sm:flex-row justify-center  gap-4 sm:gap-6 mt-6 font-semibold">
              <div className="flex items-center justify-center gap-2 text-base md:text-xl ">
                <HiOutlineClock />
                <span>12–14 Days</span>
              </div>
              <div className="flex items-center justify-center gap-2  text-base md:text-xl">
                <FaMapMarkerAlt />
                <h1>Everest (Khumbu), Nepal</h1>
              </div>
              <div className="flex items-center justify-center gap-2  text-base md:text-xl">
                <FaHiking />
                <h1 className="font-sans">Moderate to Challenging</h1>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              text="Start Your Adventure"
              variant="primary"
              className="mt-8 mx-auto text-base p-2"
            />
          </div>
        </div>
      </section>

      {/*PartnerSection*/}
      <section><PartnerSection partnersdata={partnersdata.data} /></section>

     <section className="relative ">
  {/* Left Arrow – hidden on sm, shown on md+ */}
  <div className="hidden md:block absolute top-[65%] md:left-[100px] -translate-y-1/2 z-10 ">
    <ArrowIcon
      direction="left"
      variant="primary"
    
    />
  </div>

  {/* Carousel */}
  <div className="">
    <TestimonialCarousel testimoinaldata={testimoinaldata} />
  </div>

  {/* Right Arrow – hidden on sm, shown on md+ */}
  <div className="hidden md:block absolute top-[65%] md:right-[100px] -translate-y-1/2 z-10">
    <ArrowIcon
      direction="right"
      variant="primary"
      
    />
  </div>
</section>





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

              <TextDescription text="Show us your #BestFamilyMoments by tagging us @Fusion Expeditions for a chance to be featured!" className="w-[300px] md:w-[400px] lg:w-[400px] text-[#FFFFFF] opacity-90" />
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
                <h1 className="text-xl font-bold">{blogsdata.data[0].subtitle}</h1>
                <p className="mt-2 h-[155px]"></p>
              
                
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
                      <h1 className="text-lg font-semibold">{card.subtitle}</h1>
                      <TextDescription text={card.description} className=" line-clamp-3 " />
                    </div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </section>





    </>
  );
}