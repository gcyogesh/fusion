import React from 'react';
import Link from 'next/link';
import HeroBanner from '@/components/organisms/Banner/HeroBanner';
import { fetchAPI } from '@/utils/apiService';
import TextDescription from '@/components/atoms/description';
import ImageDisplay from '@/components/atoms/ImageCard';
import TextHeader from '@/components/atoms/headings';
import Breadcrumb from "@/components/atoms/breadcrumb";

const Blogs = async () => {
  const blogsdata = await fetchAPI({ endpoint: "blogs" });
  const herodata = await fetchAPI({ endpoint: "herobanner/blog" });

  const leftBlogs = blogsdata.data.slice(0, 3);
  const rightBlogs = blogsdata.data.slice(6);

  return (
    <>
      <Breadcrumb currentnavlink="Blogs" />
      <HeroBanner herodata={herodata?.data} />

      <section className="max-w-7xl mx-auto px-4">
        <TextHeader
          text="Explore Our Blogs"
          buttonText="From the Blogs"
          className="mb-8"
          type="main"
          specialWordsIndices="2"
          width={500}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: First 3 Blogs as Large Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {leftBlogs.map((card: any) => (
              <Link href={`/blogs/${card.slug}`} key={card.id}>
                <div className="aspect-video w-full cursor-pointer">
                  <ImageDisplay
                    src={card.imageUrl}
                    variant="rectangle"
                    title={card.subtitle}
                    description={card.subtitle}
                  />
                  <div className="mt-3">
                    <h3 className="text-xl font-bold">{card.subtitle}</h3>
                    <p className="mt-2">{card.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side: Next 3 Blogs as Small Cards */}
          <div className="flex flex-col">
            {rightBlogs.map((card: any) => (
              <Link href={`/blogs/${card.slug}`} key={card.id}>
                <div className="flex flex-col cursor-pointer">
                  <ImageDisplay
                    src={card.imageUrl}
                    variant="smallrectangle"
                    title={card.subtitle}
                    description={card.description}
                  />
                  <div className="mt-2 mb-4 h-[150px]">
                    <h3 className="text-lg font-semibold">{card.subtitle}</h3>
                    <TextDescription
                      text={card.description}
                      className="text-justify line-clamp-3"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;