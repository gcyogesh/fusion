  import React from 'react';
  import HeroBanner from '@/components/organisms/Banner/HeroBanner';
  import { fetchAPI } from '@/utils/apiService';
  import TextDescription from '@/components/atoms/description';
  import ImageDisplay from '@/components/atoms/ImageCard';
  import TextHeader from '@/components/atoms/headings';
  import Breadcrumb from "@/components/atoms/breadcrumb";
  const Blogs = async () => {
    const blogsdata = await fetchAPI({ endpoint: "blogs" });
    // Remaining blogs
  const herodata =  await fetchAPI({ endpoint: "herobanner/blog   " });
    return (
      <>
      
        <Breadcrumb currentnavlink="Blogs" />
        
        <HeroBanner herodata={herodata?.data} />
      
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
                  <div className="mt-2 h-[150px] ">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <TextDescription text={card.description} className="text-justify line-clamp-3 " />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  export default Blogs;
