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
import { FaUsers, FaLeaf, FaMountain, FaCompass } from "react-icons/fa";

import TestimonialCarousel from "@/components/organisms/testimonial/testimoinal";
import { FaTrophy, FaStar, FaGlobe  } from "react-icons/fa";
import TextDescription from "@/components/atoms/description";
import { data } from "framer-motion/client";
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
  },  {
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


const topcategories = [
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description: "Explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description: "explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description: "Explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
]
interface DestinationCard {
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
const values = [
  {
    icon: <FaUsers className="text-3xl text-yellow-700 " />,
    title: "Customer-Centric",
    description:
      "Your experience is at the heart of everything we do. We listen, care, and curate every trip based on what matters most to you — making your travel seamless and memorable.",
  },
  {
    icon: <FaLeaf className="text-3xl text-green-700" />,
    title: "Sustainable Travel",
    description:
      "We believe in preserving the beauty of Nepal for generations to come. Our trips focus on eco-conscious travel, supporting local communities, and minimizing our environmental impact.",
  },
  {
    icon: <FaMountain className="text-3xl text-purple-700" />,
    title: "Authentic Experiences",
    description:
      "Go beyond the ordinary. We craft journeys that connect you deeply with Nepal’s rich culture, warm people, and breathtaking landscapes — experiences that leave a lasting impact.",
  },
  {
    icon: <FaCompass className="text-3xl text-blue-700" />,
    title: "Expert Local Guides",
    description:
      "Explore Nepal with passionate, knowledgeable local experts who bring destinations to life and ensure your safety, comfort, and enjoyment every step of the way.",
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
  { icon: <FaInstagram className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-10 h-10"/>, link: "#" },
  { icon: <FaFacebookF className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-10 h-10 "/>, link: "#" },
  { icon: <FaYoutube className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-10 h-10 "/>, link: "#" },
];

export default async function Home() {
  const partnersdata = await fetchAPI({ endpoint: "partners" });
  const blogsdata = await fetchAPI({ endpoint: "blogs" });
  const destinationdata = await fetchAPI({ endpoint: "destinations" });
  const testimoinaldata = await fetchAPI({ endpoint: "testimonials" });
const herosectiondata = await fetchAPI({ endpoint: "herobanner/home" });
  return (
   <>
   
   <HeroSection herodata={herosectiondata.data}/>
 <div className="absolute w-full max-w-[1100px] mx-auto left-0 right-0 top-[105%] md:top-[96%] lg:top-[95%] px-2">
  <div className="flex items-center justify-between bg-white rounded-full px-2 sm:px-4 py-2 sm:py-3 shadow-lg gap-2 overflow-x-auto">

    {/* Location */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaMapMarkerAlt className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold">Location</span>
        <span className="text-gray-500 truncate">Enter your destination</span>
      </div>
    </div>

    {/* Date */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaCalendarAlt className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold">Date</span>
        <span className="text-gray-500 truncate">Choose your dates</span>
      </div>
    </div>

    {/* Price */}
    <div className="flex items-center space-x-1 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
      <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
        <FaDollarSign className="text-[#0E334F] text-xs md:text-2xl" />
      </span>
      <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
        <span className="font-bold ">Price</span>
        <span className="text-gray-500 truncate">Enter your budget</span>
      </div>
    </div>

    {/* Button */}
    <div className="flex flex-shrink-0">
      <button className="flex items-center bg-[#0E334F] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium hover:bg-blue-800 transition whitespace-nowrap text-xs sm:text-sm md:text-base">
        {/* Icon only on small screen */}
        <span className="block sm:hidden">
          <FaSearch className="text-white text-sm" />
        </span>
        {/* Text + icon on sm and above */}
        <span className="hidden sm:flex items-center">
          Find My Adventure
          <span className="ml-2 bg-white p-4 rounded-full">
            <FaSearch className="text-[#0E334F] text-sm" />
          </span>
        </span>
      </button>
    </div>

  </div>
</div>


  
    <div className="bg-[#FCE1AC] py-25 px-6 ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-30">
          {/* Left Section */}
          <div className="md:w-5/12">
          <TextHeader
          text="Our true values for your unforgettable journey"
          specialWordsIndices="[1,2]"
          align="left"
          width="622px"
          buttonText="Why Fusion Expedition"
        />
        <div className="flex flex-col justify-end h-100">
            <p className="mt-10 text-gray-700 text-base leading-relaxed">
        
            </p>
            <TextDescription text="Our values are more than promises – they’re the soul of every adventure we offer.
              Rooted in sustainability, authenticity, and guest-first service, we ensure that your
              journey through Nepal is meaningful and truly one of a kind." />
            </div>
          </div>
  
          {/* Right Section */}
          <div className="md:w-5/10 space-y-3 mt-14">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-center bg-[#FEF2D6] shadow-sm rounded-xl p-2 pb-[-5] border border-black"
              >
                <div className="mb-10 mr-4  border boder-black rounded-full p-3 ">{value.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Best Destination */}
      
      <section className="max-w-7xl mx-auto mb-16 px-10">
  <TextHeader
    text="Where Dreams Meet Destinations"
    buttonText="Popular Tour"
    specialWordsIndices="3"
    size="medium"
    width={622}
    align="center"
    className="mb-8" // Increased spacing for better visual balance

  
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 "> {/* Consistent gap */}
   

    {(destinationdata as DestinationData)?.data.map((card, index) => (
      <div key={index} className="flex flex-col gap-4">
        <div className="aspect-video">
          <ImageDisplay
            src={card.imageUrl}
            variant="square"
            snippet={card.tags[0]}
            snippetPosition="start"
            title={card.title} 
            description={card.subtitle}         />
        </div>

        <div className="flex flex-col gap-3"> {/* Add consistent internal gap */}
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

          <div className="w-full h-[1.5px] bg-[#C2C2C2]" /> {/* Consistent thickness and color */}

          <div className="text-lg font-semibold mt-2">
            Start From <span className="ml-10 text-orange-500 ">${card.priceMin}-${card.priceMax}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

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
          <div className="text-white space-y-1 md:space-y-6 text-xs  md:text-base">
            <div className="space-y-2 sm:space-y-1">
              <div className="flex items-center gap-3">
                <FaCloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                <h1 className="text-white text-base md:text-2xl font-semibold">
                  Feel the freedom<br />in the sky
                </h1>
              </div>

              <TextHeader
                text="Pokhara Ultralight Flight Adventure"
                specialWordsIndices="1"
                align="left"
                size="medium"
                textcolor="white"
                className="w-[250px]  md:w-[400px] "
              />
            </div>

            <div className="w-full h-px bg-white/30 mb-3 sm:mb-1 md:mb-3" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-1 md:mt-6 ">
              <div className="space-y-0 md:space-y-4 text-base md:text-base sm:text-sm">
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
                <Button text="BOOK NOW" variant="primary" className="text-xs sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="w-full flex flex-row justify-end  pl-6 md:pl-0 lg:pl-0">
            <div className="rounded-xl shadow-md  border border-gray-400  backdrop-blur-md p-3 overflow-hidden">
              <ImageDisplay
                src="/images/pokharaflight.png"
                alt="Ultralight Flight"
                variant="smallsquare"
                width={450}
                height={350}
                className="object-cover w-full h-auto "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




<section className="max-w-7xl mx-auto px-6 mb-16">
  <TextHeader
    text="Unforgettable Experiences Await"
    align="left"
    width="500px"
    specialWordsIndices="1"
    buttonText="Tour Categories"
    className="mb-8"
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10    ">
    {topcategories.map((card, index) => (
      <div key={index} className="flex flex-col gap-2">
        <div className="aspect-square">
          <ImageDisplay
            src={card.src}
            variant="square"
            snippet={card.snippet}  
            snippetPosition="start"
            title={card.title} 
            description={card.subtitle}  

          />
        </div>
        <div className="px-2 flex flex-col">
          <TextHeader text={card?.title} size="small" align="left" />
          <h2 className="text-lg font-semibold">{card.subtitle}</h2>
          <p className="text-gray-600 text-justify">
            {card.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
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
          className="text-gray-600"/>
          
      </div>
    ))}
  </div>
</section>
<section>

  
</section>
<PartnerSection partnersdata={partnersdata.data} />
      {/* Everest Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mb-16 rounded-lg overflow-hidden bg-orange-50">
  <div className="absolute inset-0">
    <Image
      src="/images/EverestBackground.png"
      alt="Everest Background"
      fill
      className="object-cover"
    />
  </div>

  <div className="relative z-10 flex flex-col justify-center items-center text-center">
    <div className="w-full max-w-3xl px-4">
      <TextHeader
        text="Our Everest Base Camp Trek is loved worldwide"
        align="center"
        width="100%" // let it be full width and responsive
        className=""
      />
  
      <TextDescription
        text="Everest Base Camp Trek is a world-renowned adventure that takes you deep into the heart of the Himalayas. Experience breathtaking views."
        className="mt-4 "/>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6">
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <HiOutlineClock className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>12-14 Days</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Everest (Khumbu), Nepal</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <FaHiking className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Moderate to Challenging</span>
        </div>
      </div>
      <Button 
        text="Start Your Adventure" 
        variant="primary" 
        className="mt-8 mx-auto" 
      />
    </div>
  </div>
</section>


   
      <section className="max-w-7xl mx-auto px-6  mb-16">
  <TextHeader
    text="Adventure Awaits: Travel Stories & Tips"
    buttonText="From the Blogs"
  className="mb-8"
    type="main"
    specialWordsIndices="2"
    width={500}

  />

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    {/* Left Side: Large Blog Post */}
    <div className="lg:col-span-2 flex flex-col">
      <div className="aspect-video w-full">
        <ImageDisplay src={blogsdata.data[0].imageUrl} variant="rectangle" title={blogsdata.data[0].title} 
            description={blogsdata.data[0].subtitle} />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold">{blogsdata.data[0].title}</h3>
        <p className="mt-2 text-gray-600">{blogsdata.data[0].subtitle}</p>
      </div>
    </div>

    {/* Right Side: Two Small Blog Posts */}
    <div className="flex flex-col   ">
      {blogsdata.data.slice(1, 3).map((card: { id: string; imageUrl: string; title: string; description: string }) => (
        <div key={card.id} className="flex flex-col">
          <div className="">
        <ImageDisplay src={card.imageUrl} variant="smallrectangle"  title={card.title} description={card.description}   />
          </div>
          <div className="mt-4">
        <h3 className="text-lg font-semibold">{card.title}</h3>
        <TextDescription text={card.description} className="text-justify" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="max-w-7xl mx-auto mb-16 px-6">
  <TextHeader
    text="Adventure Awaits: Travel Stories "
    buttonText="From the Blogs"
    className="mb-8"
    specialWordsIndices="2"
    width={500}
  />

  {/* First Row */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
    {/* Rectangle Image (spans 2 columns) */}
    <div className="lg:col-span-2">
      <ImageDisplay src={imageCards[0].src} variant="rectangle" width={840} height={430} title={imageCards[0].title}  />
    </div>

    {/* Square Image */}
    <div>
      <ImageDisplay src={imageCards[1].src} variant="square" title={imageCards[1].title}/>
    </div>
  </div>

  {/* Second Row with 3 Square Images */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {imageCards.slice(2, 5).map((card , index) => (
      <div key={index}>
        <ImageDisplay src={card.src} variant="square" alt="Pashpati" snippet="popular" title={card.title} />
      </div>
    ))}
  </div>
<section>
  <TestimonialCarousel testimoinaldata={testimoinaldata}/>
  </section>
</section>

{/* Share the joy of your journey */}
      <section className=" bg-blue-950 ">
        <div className="max-w-7xl mx-auto text-white space-y-4 md:px-0 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
  {/* Left Side: Header and Paragraph */}
     <div className="flex flex-col items-start space-y-4">
      <TextHeader
      text="Share the joy of your journey"
      specialWordsIndices="2"
      align="start"
      width="400px"
      textcolor="white"
    />
   
    <TextDescription text="  Join our community of travelers and share your unforgettable experiences with us. Your stories inspire others to explore the world." className="w-[200px] md:w-[500px] "  />
  </div>

  {/* Right Side: Social Links */}
  <div className="flex justify-end space-x-4 mt-12 ">
    {socialLinks.map((link, index) => (
      <a key={index} href={link.link} className="hover:scale-110 transition-transform">
        <span>{link.icon}</span>
      </a>
    ))}
  </div>
    </div>

          
          
           
          <div className=" flex flex-cols-1 gap-2 m-2 md:m-0 lgm-0 md:gap-6 lg:gap-6">
      
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

   </>
  );
}