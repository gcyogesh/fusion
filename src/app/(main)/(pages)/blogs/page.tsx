import React from 'react';
import Link from 'next/link';
import HeroBanner, { HeroBannerData } from '@/components/organisms/Banner/HeroBanner';
import { fetchAPI } from '@/utils/apiService';
import TextDescription from '@/components/atoms/description';
import ImageDisplay from '@/components/atoms/ImageCard';
import Breadcrumb from "@/components/atoms/breadcrumb";
import Pagination from '@/components/atoms/pagination';
import MidNavbar from '@/components/organisms/MidNavBar';

type Props = {
  searchParams?: {
    page?: string;
    category?: string;
  };
};

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  category: BlogCategory;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BlogAPIResponse {
  success: boolean;
  message: string;
  data: Blog[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryAPIResponse {
  success: boolean;
  message: string;
  data: Category[];
}

interface HeroBannerAPIResponse {
  success: boolean;
  message: string;
  data: HeroBannerData;
}

const Blogs = async ({ searchParams }: Props) => {
  const currentPage = parseInt(searchParams?.page || '1', 10);
  const selectedCategoryId = searchParams?.category || 'all';

  const [heroData, categoriesData] = await Promise.all([
    fetchAPI({ endpoint: "herobanner/blog" }) as Promise<HeroBannerAPIResponse>,
    fetchAPI({ endpoint: "category/blogs" }) as Promise<CategoryAPIResponse>
  ]);

  const categories = categoriesData?.data || [];

  // Prepare blogTabs with { label, value }
  const blogTabs = [
    { label: "All Blogs", value: "all" },
    ...categories.map((cat) => ({ label: cat.name, value: cat._id }))
  ];

  //  filtering fetch logic
  const blogsData = selectedCategoryId === 'all'
    ? await fetchAPI({ endpoint: "blogs" }) as BlogAPIResponse
    : await fetchAPI({ endpoint: `blogs/category/${selectedCategoryId}` }) as BlogAPIResponse;

  const blogs = blogsData?.data || [];

  // Pagination
  const blogsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <>
      <Breadcrumb currentnavlink="Blogs" />
      <HeroBanner herodata={heroData?.data} />

      <MidNavbar tabs={blogTabs} isBlogPage={true} />

      <section className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentBlogs[0] && (
              <div className="lg:col-span-2">
              <Link scroll={false} href={`/blogs/${currentBlogs[0].slug}`}>
                  <div className="aspect-video w-full cursor-pointer">
                    <ImageDisplay
                      src={currentBlogs[0].imageUrl}
                      variant="rectangle"
                      title={currentBlogs[0].subtitle}
                      description={currentBlogs[0].subtitle}
                      createdAt={currentBlogs[0].createdAt}
                    />
                    <div className="mt-3">
                      <h1 className="text-xl font-bold">{currentBlogs[0].subtitle}</h1>
                      <TextDescription text={currentBlogs[0].description} className="mt-2 line-clamp-5" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {currentBlogs.slice(1).map((card) => (
                <Link href={`/blogs/${card.slug}`} key={card._id}>
                  <div className="flex flex-col cursor-pointer">
                    <ImageDisplay
                      src={card.imageUrl}
                      variant="smallrectangle"
                      title={card.subtitle}
                      description={card.description}
                      createdAt={card.createdAt}
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
          getPageUrl={(page) =>
            selectedCategoryId === 'all'
              ? `/blogs?page=${page}`
              : `/blogs?page=${page}&category=${selectedCategoryId}`
          }
        />
      </section>
    </>
  );
};

export default Blogs;
