import { notFound } from "next/navigation";
import { fetchAPI } from "@/utils/apiService";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const blogEndpoint = `blogs/${params.slug}`;
  const blogdata = await fetchAPI({ endpoint: blogEndpoint });

  if (!blogdata || Object.keys(blogdata).length === 0) notFound();

  const relatedEndpoint = `blogs/category/${params.slug}`;
  const relatedData = await fetchAPI({ endpoint: relatedEndpoint });
  const relatedBlogs: any[] = relatedData?.data || [];

  const hasPrimaryBlog = relatedBlogs.length > 0;
  const secondaryBlogs = relatedBlogs.slice(1, 3);

  return (
    <section>
      <div className="mx-auto max-w-7xl py-18 px-4 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <TextHeader text={blogdata.data.subtitle} align="left" width={500} />
          <TextDescription text={blogdata.data.description} />

          {/* Quick Facts Section */}
          <div className="border border-gray-300 rounded-md p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">Quick Facts about Nepal:</h2>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1 pl-2">
              <li>Location: In South Asia (coordinates: 28°N 84°15′E)</li>
              <li>Currency: Nepalese Rupee (NPR)</li>
              <li>Capital: Kathmandu (Capital and the largest city)</li>
              <li>Population: Around 30 million (2022 estimate)</li>
              <li>Official Language: Nepali</li>
              <li>Religion: Hinduism (81.3%), Buddhism (9%), Islam (4.4%), Kirat (3.1%), Christianity (1.4%), Others (0.8%)</li>
              <li>Time Zone: UTC+05:45</li>
              <li>Primary Airport: Tribhuvan International Airport (TIA), Kathmandu</li>
              <li>Country Code: +977</li>
              <li>Driving: on the left-hand side</li>
              <li>Area: 147,516 sq. km</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[300px] ml-auto">
          <div className="sticky top-24 space-y-6">
            {/* Related Blogs */}
            <div className="border p-4 rounded-md shadow-md bg-white">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Related Blogs</h3>
              {relatedBlogs.length > 0 ? (
                <ul className="space-y-3">
                  {relatedBlogs.map((blog) => (
                    <li key={blog.id} className="flex justify-between items-center border-b pb-2">
                      <Link href={`/blogs/${blog.slug}`} className="text-sm text-gray-700 hover:text-orange-500">
                        {blog.subtitle}
                      </Link>
                      <span className="text-orange-500 text-xl">↗</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No related blogs found.</p>
              )}
            </div>

            {/* Share in Section */}
            <div className="border p-4 rounded-md shadow-md bg-white">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Share in</h3>
              <div className="flex space-x-4 text-orange-500 text-xl">
                <FaInstagram />
                <FaFacebookF />
                <FaYoutube />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Blogs Section */}
      {hasPrimaryBlog && (
        <section className="max-w-7xl mx-auto px-4">
          <TextHeader
            text="Related Blogs"
        align="left"
            className="mb-8"
            type="main"
            specialWordsIndices="2"
            width={500}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Blog Post */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="aspect-video w-full">
                <ImageDisplay
                  src={relatedBlogs[0].imageUrl}
                  variant="rectangle"
                  title={relatedBlogs[0].title}
                  description={relatedBlogs[0].subtitle}
                />
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-bold">{relatedBlogs[0].title}</h3>
                <p className="mt-2 h-[155px]">{relatedBlogs[0].subtitle}</p>
              </div>
            </div>

            {/* Two Small Blog Posts */}
            <div className="flex flex-col gap-y-[25px]">
              {secondaryBlogs.map((card) => (
                <div key={card.id} className="flex flex-col">
                  <ImageDisplay
                    src={card.imageUrl}
                    variant="smallrectangle"
                    title={card.title}
                    description={card.description}
                  />
                  <div className="mt-4 h-[150px]">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <TextDescription text={card.description} className="text-justify" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
