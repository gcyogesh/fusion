'use client';
import { FaUsers, FaLeaf, FaMountain, FaCompass } from "react-icons/fa";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";

const values = [
  {
    icon: <FaUsers className="text-3xl text-[#002B45] " />,
    title: "Customer-Centric",
    description:
      "Your experience is at the heart of everything we do. We listen, care, and curate every trip based on what matters most to you — making your travel seamless and memorable.",
  },
  {
    icon: <FaLeaf className="text-3xl text-[#002B45]" />,
    title: "Sustainable Travel",
    description:
      "We believe in preserving the beauty of Nepal for generations to come. Our trips focus on eco-conscious travel, supporting local communities, and minimizing our environmental impact.",
  },
  {
    icon: <FaMountain className="text-3xl text-[#002B45]" />,
    title: "Authentic Experiences",
    description:
      "Go beyond the ordinary. We craft journeys that connect you deeply with Nepal’s rich culture, warm people, and breathtaking landscapes — experiences that leave a lasting impact.",
  },
  {
    icon: <FaCompass className="text-3xl text-[#002B45]" />,
    title: "Expert Local Guides",
    description:
      "Explore Nepal with passionate, knowledgeable local experts who bring destinations to life and ensure your safety, comfort, and enjoyment every step of the way.",
  },
];

const ValuesSection = () => {
    return (
<div className="relative z-10 bg-[#FCE1AC] py-30 ">
        <div className="max-w-7xl mx-auto flex flex-col gap-10 md:flex-row justify-between items-start md:items-center ">

          {/* Left Section */}
          <div className="w-full md:w-5/12 ">
            <TextHeader
              text="Our true values for your unforgettable journey"
              specialWordsIndices="1,2"
              align="left"
              width="622px"
              buttonText="Why Fusion Expedition"
            />
            <div className="flex flex-col justify-end h-full mt-10 md:mt-80 lg:mt-80">
              <TextDescription text="Our values are more than promises – they’re the soul of every adventure we offer.
          Rooted in sustainability, authenticity, and guest-first service, we ensure that your
          journey through Nepal is meaningful and truly one of a kind." />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-[42%] space-y-3.5  ">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-center bg-[#FEF2D6] shadow-sm rounded-xl p-4 border border-black"
              >
                <div className="mr-2 ml-1.5 mb-4 border border-black rounded-full p-3">{value.icon}</div>
                <div>
                  <h3 className="text-xl  font-semibold mb-1">{value.title}</h3>
                  <p className="text-sm  m-1">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
}

export default ValuesSection;
