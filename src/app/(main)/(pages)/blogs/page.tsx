import React from 'react';
import Link from 'next/link';
import HeroBanner from '@/components/organisms/Banner/HeroBanner'; //kapil push
import { fetchAPI } from '@/utils/apiService';
import TextDescription from '@/components/atoms/description';
import ImageDisplay from '@/components/atoms/ImageCard';
import TextHeader from '@/components/atoms/headings';
import Breadcrumb from "@/components/atoms/breadcrumb";
import Pagination from '@/components/atoms/pagination';

type Props = {
  searchParams?: {
    page?: string;
  };
};

const Blogs = async ({ searchParams }: Props) => {
  const blogsdata = await fetchAPI({ endpoint: "blogs" });
  const herodata = await fetchAPI({ endpoint: "herobanner/blog" });

  const blogs = blogsdata?.data || [];
  const currentPage = parseInt(searchParams?.page || '1', 10);
  const blogsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

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

        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentBlogs[0] && (
              <div className="lg:col-span-2">
                <Link href={`/blogs/${currentBlogs[0].slug}`}>
                  <div className="aspect-video w-full cursor-pointer">
                    <ImageDisplay
                      src={currentBlogs[0].imageUrl}
                      variant="rectangle"
                      title={currentBlogs[0].subtitle}
                      description={currentBlogs[0].subtitle}
                    />
                    <div className="mt-3">
                      <h1 className="text-xl font-bold">{currentBlogs[0].subtitle}</h1>
                      <p className="mt-2">{currentBlogs[0].description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {currentBlogs.slice(1).map((card: any) => (
                <Link href={`/blogs/${card.slug}`} key={card.id}>
                  <div className="flex flex-col cursor-pointer">
                    <ImageDisplay
                      src={card.imageUrl}
                      variant="smallrectangle"
                      title={card.subtitle}
                      description={card.description}
                    />
                    <div className="mt-2 h-[150px]">
                      <h1 className="text-lg font-semibold">{card.subtitle}</h1>
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
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getPageUrl={(page) => `/blogs?page=${page}`}
        />
      </section>
    </>
  );
};

export default Blogs;
