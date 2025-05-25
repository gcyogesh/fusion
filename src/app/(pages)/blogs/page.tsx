import React from 'react';
import HeroBanner from '@/components/organisms/Banner/HeroBanner';
import { fetchAPI } from '@/utils/apiService';
import TextDescription from '@/components/atoms/description';
import ImageDisplay from '@/components/atoms/ImageCard';
import MidNavbar from '@/components/organisms/MidNavBar';
const Blogs = async () => {
  const blogsdata = await fetchAPI({ endpoint: "blogs" });

  const firstThree = blogsdata.data.slice(0, 3); // First 3 rectangle
  const rest = blogsdata.data.slice(3);          // Remaining blogs
const herodata =  await fetchAPI({ endpoint: "herobanner/blog   " });
  return (
    <>
      <HeroBanner herodata={herodata?.data} />
    <MidNavbar />
      <section className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {/* Left Side: First 3 Rectangle Blogs */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {firstThree.map((item, index) => (
              <div key={index}>
                <ImageDisplay 
                  src={item.imageUrl} 
                  variant="rectangle" 
                  title={item.title} 
                  description={item.subtitle} 
                />
                <div className="mt-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Remaining Blogs */}
          <div className="flex flex-col gap-6">
            {rest.map((card, index) => {
              const isEven = index % 2 === 0;
              const variant = isEven ? "smallsquare" : "smallsquare";

              return (
                <div key={card.id} className="flex flex-col">
                  <ImageDisplay 
                    src={card.imageUrl} 
                    variant={variant} 
                    title={card.title} 
                    description={card.description} 
                  />
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <TextDescription text={card.description} className="text-justify mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
