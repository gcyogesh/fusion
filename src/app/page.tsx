import Image from "next/image";
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaSearch } from 'react-icons/fa';
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { HiOutlineClock } from 'react-icons/hi';
import HeroSection from "@/components/organisms/HeroSection";
import { FaHiking } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { FaCloudSun } from 'react-icons/fa'
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

//molecules components
import TopCategoriesSection from "@/components/molecules/TopCategoriesSection";
import ValuesSection from "@/components/molecules/ValueSection";

const imageCards = [
  {
    src: "/image.png",
    title: "Dreamy Beach Escape",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "Mountain Adventure",
    variant: "square",
    snippet: "Top Pick",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "City Lights Weekend",
    variant: "square",
    snippet: "Limited Time",
    snippetPosition: "start",
  }, {
    src: "/image.png",
    title: "Mountain Adventure",
    variant: "square",
    snippet: "Top Pick",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "City Lights Weekend",
    variant: "square",
    snippet: "Limited Time",
    snippetPosition: "start",
  },


];



interface DestinationCard {
  slug: any;
  subtitle: string;
  imageUrl: string;
  tags: string[];
  location: string;
  duration: number;
  title: string;
  priceMin: number;
  priceMax: number;
}

interface DestinationData {
  data: DestinationCard[];
}


const stats = [
  {
    icon: <FaTrophy className="text-4xl text-[#002B45]" />,
    title: "18+",
    subtitle: "Years of Experience",
    description: "Seasoned in travel excellence since day one.",
  },
  {
    icon: <FaStar className="text-4xl text-[#002B45]" />,
    title: "2750+",
    subtitle: "TripAdvisor Reviews",
    description: "Loved and trusted by thousands of travelers.",
  },
  {
    icon: <FaGlobe className="text-4xl text-[#002B45]" />,
    title: "116+",
    subtitle: "Cultural Tours",
    description: "Experience the heart of tradition and heritage with us.",
  },
  {
    icon: <FaHiking className="text-4xl text-[#002B45]" />,
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
  const testimoinaldata = await fetchAPI({ endpoint: "testimonials" });
  const herosectiondata = await fetchAPI({ endpoint: "herobanner/home" });
  return (
    <>

      <HeroSection herodata={herosectiondata.data} />


      {/*Value secction */}
      < ValuesSection/>
      
      {/*Featured Experience: destination */}

      <section className="max-w-7xl mx-auto ">
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


          {(destinationdata as DestinationData)?.data.map((card, index) => (
            <Link href={`/destinations/${card.slug}`} key={index} className="flex flex-col gap-4">
              <div className="aspect-video">
                <ImageDisplay
                  src={card.imageUrl}
                  variant="square"
                  snippet={card.tags[0]}
                  snippetPosition="start"
                  title={card.title}
                  description={card.subtitle}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <CiLocationOn className="w-5 h-5" />
                    {card.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineClock className="w-5 h-5" />
                    {card.duration} days
                  </span>
                </div>

                <TextHeader text={card?.subtitle} size="small" align="left" width={410} />

                <div className="w-full h-[1 .5px] bg-[#C2C2C2]" />

                <div className="text-lg font-semibold mt-2">
                  Start From <span className="ml-10 text-orange-500 ">${card.priceMin}-${card.priceMax}</span>
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
          <div className="w-full max-w-7xl mx-auto py-6 sm:py-0">
            {/* Scale wrapper for responsiveness */}
            <div className="transform origin-top scale-[0.85] sm:scale-100">
              <div className="grid grid-cols-2 items-center  max-w-full">

                {/* Left Content */}
                <div className="text-white space-y-3 md:space-y-6 text-xs  md:text-base">
                  <div className="space-y-2 sm:space-y-1">
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
                      className="w-[250px]  md:w-[400px]  mt-2"
                    />
                  </div>

                  <div className="w-auto md:w-[530px] h-px bg-white/30 mb-3 sm:mb-1 md:mb-3" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 w-[530px] gap-4 mt-6 sm:mt-1 md:mt-6 ">
                    <div className="space-y-0 md:space-y-4 text-sm md:text-xl lg:text-xl ">
                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>30 Minutes – 90 Minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineCurrencyDollar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex items-center gap-x-2 md:gap-x-4">
                          Start From <span className="text-orange-400 font-semibold">$120 – $250</span>
                        </span>

                      </div>
                    </div>

                    <div className="flex justify-start sm:justify-end items-end">
                      <Button text="Book Now" variant="primary" className="text-xs flex  sm:text-sm " />
                    </div>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="w-full flex flex-row justify-end  pl-10 md:pl-0 lg:pl-0">
                  <div className="rounded-xl shadow-md  border border-gray-400  backdrop-blur-md p-3 ">
                    <ImageDisplay
                      src="/images/pokharaflight.png"
                      alt="Ultralight Flight"
                      variant="smallsquare"
                      width={455}
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

      {/*ranks */}
      <section >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {stat.icon}
                <TextHeader
                  text={stat.title}
                  size="medium"
                  align="left"
                  width="auto"
                />
              </div>
              <TextHeader
                text={stat.subtitle}
                size="small"
                align="center"
                width="100%"
                className="text-gray-600"
              />
              <TextDescription
                text={stat.description}
                className="text-gray-600" />

            </div>
          ))}
        </div>
      </section>



      {/*Best destination */}

      <section className="max-w-7xl mx-auto ">
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
            <ImageDisplay src={imageCards[0].src} variant="rectangle" width={840} height={430} title={imageCards[0].title} />
          </div>

          {/* Square Image */}
          <div>
            <ImageDisplay src={imageCards[1].src} variant="square" title={imageCards[1].title} />
          </div>
        </div>

        {/* Second Row with 3 Square Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageCards.slice(2, 5).map((card, index) => (
            <div key={index}>
              <ImageDisplay src={card.src} variant="square" alt="Pashpati" snippet="popular" title={card.title} />
            </div>
          ))}
        </div>

      </section>

      {/*Tour Categories */}
      <TopCategoriesSection

        buttonText="Tour Categories"
      />


      {/* Everest Section */}
      <section className="relative z-0 max-w-7xl mx-auto mt-20 rounded-lg overflow-hidden">
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
              <div className="flex items-center justify-center gap-2 text-sm md:text-base ">
                <HiOutlineClock />
                <span>12–14 Days</span>
              </div>
              <div className="flex items-center justify-center gap-2  text-sm md:text-base">
                <FaMapMarkerAlt />
                <h1>Everest (Khumbu), Nepal</h1>
              </div>
              <div className="flex items-center justify-center gap-2  text-sm md:text-base">
                <FaHiking />
                <h1 className="font-sans">Moderate to Challenging</h1>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              text="Start Your Adventure"
              variant="primary"
              className="mt-8 mx-auto"
            />
          </div>
        </div>
      </section>

      {/*PartnerSection*/}
      <section><PartnerSection partnersdata={partnersdata.data} /></section>

      {/*Testimonial */}
      <section>
        <TestimonialCarousel testimoinaldata={testimoinaldata} />
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

              <TextDescription text="Show us your #BestFamilyMoments by tagging us @Fusion Expeditions for a chance to be featured!" className="w-[300px] md:w-[400px] lg:w-[400px] " />
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
                     / >
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
            <div className="aspect-video w-full">
              <ImageDisplay src={blogsdata.data[0].imageUrl} variant="rectangle" title={blogsdata.data[0].title}
                description={blogsdata.data[0].subtitle} />
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold">{blogsdata.data[0].title}</h3>
              <p className="mt-2 h-[155px]">{blogsdata.data[0].subtitle}</p>
            </div>
          </div>

          {/* Right Side: Two Small Blog Posts */}
          <div className="flex flex-col gap-y-[25px] ">
            {blogsdata.data.slice(1, 3).map((card: { id: string; imageUrl: string; title: string; description: string }) => (
              <div key={card.id} className="flex flex-col">
                <div className="">
                  <ImageDisplay src={card.imageUrl} variant="smallrectangle" title={card.title} description={card.description} />
                </div>
                <div className="mt-4 h-[150px] ">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <TextDescription text={card.description} className="text-justify " />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>





    </>
  );
}