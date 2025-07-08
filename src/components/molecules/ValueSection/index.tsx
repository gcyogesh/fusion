'use client';
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Image from "next/image";

const values = [
  {
   icon: (
      <Image
        src="/images/bxs_user.png"
        alt="Customer-Centeric"
        width={32}
        height={32}
        className="w-8 h-8 md:w-22 md:h-10"
      />
    ),
    title: "Customer-Centric",
    description:
      "Your experience is at the heart of everything we do. We listen, care, and curate every trip based on what matters most to you — making your travel seamless and memorable.",
  },
  {
    icon: (
      <Image
        src="/images/mdi_leaf.png"
        alt="Sustainable Travel Icon"
        width={32}
        height={32}
        className="w-8 h-8 md:w-22 md:h-10"
      />
    ),
    title: "Sustainable Travel",
    description:
      "We believe in preserving the beauty of Nepal for generations to come. Our trips focus on eco-conscious travel, supporting local communities, and minimizing our environmental impact.",
  },
  {
    icon: (
      <Image
        src="/images/mdi_flight.png"
        alt="Authentic Experiences Icon"
        width={32}
        height={32}
        className="w-8 h-8 md:w-22 md:h-10"
      />
    ),
    title: "Authentic Experiences",
    description:
      "Go beyond the ordinary. We craft journeys that connect you deeply with Nepal’s rich culture, warm people, and breathtaking landscapes — experiences that leave a lasting impact.",
  },
  {
    icon: (
      <Image
        src="/images/material-symbols_star-rounded.png"
        alt="Expert Local Guides Icon"
        width={32}
        height={32}
        className="w-8 h-8 md:w-22 md:h-10"
      />
    ),
    title: "Expert Local Guides",
    description:
      "Explore Nepal with passionate, knowledgeable local experts who bring destinations to life and ensure your safety, comfort, and enjoyment every step of the way.",
  },
];

const ValuesSection = () => {
  return (
    <div className="relative z-10 bg-[#FCE1AC] py-20 px-4 sm:px-6 lg:px-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:flex-row justify-between items-start md:items-center">
        {/* Left Section */}
        <div className="w-full md:w-5/12">
         <TextHeader
  text="Our true values for your unforgettable journey"
  specialWordsIndices="1,2"
  align="left"
  width="100%"
  buttonText="Why Fusion Expedition" 
/>

          <div className="flex flex-col justify-end h-full mt-6 md:mt-80 lg:mt-80">
            <TextDescription
              text="Our values are more than promises – they’re the soul of every adventure we offer.
          Rooted in sustainability, authenticity, and guest-first service, we ensure that your
          journey through Nepal is meaningful and truly one of a kind."
              className="text-left w-full max-w-[474px]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[42%] space-y-3.5">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center bg-[#FEF2D6] shadow-sm rounded-xl p-4 border border-black"
            >
              <div className="mb-3 sm:mb-0 sm:mr-4 border border-black rounded-full px-4 py-3 self-start sm:self-auto">
                {value.icon}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold mb-1">
                  {value.title}
                </h1>
                <p className="text-sm m-1">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;
