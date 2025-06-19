 'use client';

    import React from "react";
    import { FaStar, FaQuoteRight } from "react-icons/fa";
    import TextHeader from "../../atoms/headings";
    import TextDescription from "@/components/atoms/description";

    interface TestimonialCardProps {
      message: string;
      name: string;
      position: string;
      profileImage: string;
      rating: number;
    }

    const TestimonialCard: React.FC<TestimonialCardProps> = ({ message, name, position, profileImage, rating }) => {
      return (
        <div className="flex flex-col min-w-[320px] max-w-[320px] md:max-w-[410px] h-[293px] md:h-[260px]   bg-[#FCE1AC] rounded-xl p-4  snap-center flex-shrink-0 shadow-md">
        
          {/* Testimonial Icon */}
      <FaQuoteRight className="absolute top-50 hidden md:top-60 lg:top-60 right-40 lg:right-70 text-blue text-2xl  opacity-40" />

          <div className="text-yellow-500 flex mb-3">
            {Array(rating)
              .fill(0)
              .map((_, i) => (
                <FaStar key={i} />
              ))}
          </div>
          <TextDescription text={message} className="w-full h-[150px] text-bold" />
          
        <div className="flex flex-row items-center  gap-6 mb-auto  ">
          
            <img src={profileImage} className="w-10 h-10 rounded-full object-cover" alt={name} />
            <div className="flex flex-col justify-start ">
              <p className="font-semibold text-[#2C2727] font-dmSans">{name}</p>
              <p className="text-gray-600 font-dmSans">{position}</p>
            </div>
          </div>
        </div>
      );
    };

    interface TestimonialCarouselProps {
      testimoinaldata: TestimonialCardProps[];
    }

    const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimoinaldata }) => {
      return (
        <div className="relative px-4 py-10">
          <TextHeader
            text="Memorable Journeys, Happy Clients"
            specialWordsIndices="1"
            align="center"
            width="500px"
            buttonText="Testimonials"
            className="mb-8"
          />

          {/* Scrollable Container */}
          <div className="flex  overflow-x-auto snap-x snap-mandatory gap-6 px-1 py-6 scrollbar-hide sm:justify-center sm:flex-wrap bg-[linear-gradient(90deg,_#FEF9EE_0.88%,_#1C9ADB_32.63%,_#0F7BBA_70.26%,_#FEF9EE_100%)]  sm:bg-[linear-gradient(90deg,_#FEF9EE_0.88%,_#0F7BBA_50%,_#FEF9EE_100%)]  md:bg-[linear-gradient(90deg,_#FEF9EE,_#1C9ADB,_#FEF9EE)]"
            style={{
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '60% 100%',
            }}
          >
            {testimoinaldata.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimoinaldata.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300  ${i === 0 ? "bg-orange-400" : "bg-gray-300"}`}
              ></span>
            ))}
          </div>
        </div>
      );
    };

    export default TestimonialCarousel;