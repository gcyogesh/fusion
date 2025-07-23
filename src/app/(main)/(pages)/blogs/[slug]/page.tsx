import { notFound } from "next/navigation";
import { fetchAPI , APIResponse} from "@/utils/apiService";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import ArrowIcon from "@/components/atoms/arrowIcon";
import Breadcrumb from "@/components/atoms/breadcrumb";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  category?: string;
}



interface PageProps {
  params: {
    slug: string;
  };
} 

const socialLinks = [
  {
    icon: <FaInstagram className="text-white bg-[#F7941D] p-2 rounded-xl w-8 h-8" />,
    link: "#",
  },
  {
    icon: <FaFacebookF className="text-white bg-[#F7941D] p-2 rounded-xl w-8 h-8" />,
    link: "#",
  },
  {
    icon: <FaYoutube className="text-white bg-[#F7941D] p-2 rounded-xl w-8 h-8" />,
    link: "#",
  },
];

const intro =
  "Nepal is a country of contrasts with spectacular natural richness, combine with a vibrant cultural heritage, spiritual sites and a rich historical legacy. Home to 8 of the world's 14 highest mountains, makes this country an unparalleled destination for trekkers and mountaineers alike.";

const heading = "Here are some compelling reasons to explore this Himalayan nation:";

const points = [
  "Paradise for Adventure Seeker: Nepal is often referred to as a playground for adventure enthusiasts due to the wide array of thrilling activities and experiences it offers. From scaling the world's highest peaks to navigating challenging rapids, it provides countless opportunities for adventure seekers to push their limits and embrace the adrenaline rush. Whether you seek thrilling mountaineering expeditions, awe-inspiring trekking adventures, or some adrenaline pumping activities like Paragliding, white water rafting, bunjee jumping, zip-lining, mountain biking and rock climbing, Nepal has no dearth of adventure options.",
  "Cultural and Spiritual Heritage: One of the most prominent aspects of Nepali culture is its religion. The majority of the population practices Hinduism, while Buddhism also holds significance presence. The ancient temples, shrines, and monasteries scattered throughout the country showcase the deep spiritual beliefs and rituals that have been followed for centuries. There are more than 125 different ethnic groups in Nepal, following different religions from Hinduism, Tibetan Buddhism to shamanistic and animistic practice of Bon, which made the land culturally rich. The birthplace of Gautam Buddha, Nepal is a spiritual hub for seekers and spiritual practitioners. It is a home to numerous monasteries, gompas (Buddhist monastic complexes), and retreat centers where people can engage in meditation, reflection, mindfulness and seek spiritual guidance to self-discovery and enlightenment.",
  "Rich in Wildlife and Natural Biodiversity: Nepal is home to the endangered Bengal Tiger, big Himalayan cat: Snow Leopard, One-horned Rhino, Asian Elephant, Red Panda and over 900 recorded bird species. Because of its huge geographical variation, ranging from lowland of Terai to high Himalayan mountains, Nepal boasts of verdant forests which provides shelter to 30,167 living species; including 13,067 plants and 17,097 animals. Around 23% of country's land is covered by various protected areas, including national parks, wildlife reserves, and conservation areas with notable sites like Chitwan National Park, Sagarmatha National Park and Bardia National Park. The country's ecosystems include wetlands, river systems, forests and alpine habitats which help maintain country's ecological balance and preserve its natural heritage.",
  'Warm Hospitality of the friendliest People: People in Nepal are genuinely warm and welcoming. The concept of "Atithi Devo Bhava" (Guest is God) is deeply ingrained in the Nepalese psyche, emphasizing the importance of welcoming and taking care of the visitors. People in Nepalese society are raised with a sense of collective responsibility and taking care of one another, which is why guests are treated as part of the extended family, fostering a welcoming and inclusive environment. Offering tea or food is a very common practice in Nepalese household when guests arrive, which shows care and hospitality, allowing guests to feel at home.  Nepalese people genuinely value human connections and believe in treating others with kindness and compassion, irrespective of social or cultural differences, that\'s why there comes a saying that "While you first come to Nepal for the mountains, you return here for the people."',
  "Great Value For Your Money: And finally comes a matter of Money! Nepal was named the world's 'best value destination' by Lonely Planet in 2017, because it's easy to explore this beautiful, culturally rich country on a budget. Nepalese cuisine, from Dal Bhat (rice with lentil soup and curry) to Momos (vegetables or meat dumplings), is known for its delicacy and affordability, although some fancy restaurants in Kathmandu might be expensive as costs are creeping up in the Kathmandu Valley like every other Metropolis. Public transportation is generally good and inexpensive. According to individual's preferences, there are plenty of options for accommodations from budget Hotels/ hostels to luxuries star Hotels and entry fees for the heritage sites are also reasonable. If you're a budget traveler and can adjust with basic facilities, $30-50 a day will be enough for you to explore Neal comfortably.",
];

export default async function Page({ params }: PageProps) {
  try {
    const blogRes: APIResponse<Blog> = await fetchAPI({
      endpoint: "blogs",
      slug: params.slug,
    });

    if (!blogRes?.success || !blogRes.data) {
      notFound();
    }

    const blog = blogRes.data;



    let relatedBlogs: Blog[] = [];

    try {
      const relatedEndpoint = `blogs/related?category=${blog.category}&excludeId=${blog._id}`;

      
      const relatedRes: APIResponse<Blog[]> = await fetchAPI({
        endpoint: relatedEndpoint,
      });
      

      
      relatedBlogs = relatedRes.data || [];
    } catch (error) {
      console.error("Error fetching related blogs:", error);
      console.warn("Could not fetch related blogs:", error);
    }

    

    const hasRelatedBlogs = relatedBlogs.length > 0;
    const primaryBlog = relatedBlogs[0];
    const secondaryBlogs = relatedBlogs.slice(1, 3);

    console.log("hasRelatedBlogs:", hasRelatedBlogs);
    console.log("primaryBlog:", primaryBlog);
    console.log("secondaryBlogs:", secondaryBlogs);
    console.log("=== END DEBUG INFO ===");

    return (
      <>
        <Breadcrumb currentnavlink={`Blogs / ${blog.title}`} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-y-12 gap-x-8">
          <div className="flex-1 space-y-2">
            <TextHeader text={blog.subtitle} align="left" size="large" />
            <TextDescription text={blog.description} className="text-[#535556] pb-2" />

            <div className="border border-gray-300 rounded-md p-6 bg-white shadow-sm">
              <TextHeader text="Quick Facts about Nepal" align="left" size="large" className="mb-2" />
              <ul className="list-disc pl-5 text-[#535556] space-y-2">
                <li>Location: In South Asia (coordinates: 28°N 84°15′E)</li>
                <li>Currency: Nepalese Rupee (NPR)</li>
                <li>Capital: Kathmandu</li>
                <li>Population: Around 30 million (2022 estimate)</li>
                <li>Official Language: Nepali</li>
                <li>Religion: Hinduism, Buddhism, Islam, Kirat, Christianity</li>
                <li>Time Zone: UTC+05:45</li>
                <li>Primary Airport: TIA, Kathmandu</li>
                <li>Country Code: +977</li>
                <li>Driving: Left-hand side</li>
                <li>Area: 147,516 sq. km</li>
              </ul>
            </div>

            <div className="py-6">
              <ImageDisplay
                src={blog.imageUrl}
                variant="rectangle"
                title={blog.title}
                description={blog.subtitle}
              />
            </div>

            <div className="py-2">
              <TextHeader text="Why Visit Nepal?" align="left" size="large" width={855} />
              <TextDescription text={intro} className="font-semibold text-[#535556]" />
              <TextDescription text={heading} className="font-semibold text-[#535556]" />
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-sm font-semibold text-[#535556] mt-2.5">{index + 1}.</div>
                  <TextDescription text={point} className="text-justify text-[#535556]" />
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-[340px] space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow p-4">
                <TextHeader text="Related Blogs" align="left" size="large" className="mb-2 text-[#1A1E21]" />
                {hasRelatedBlogs ? (
                  <ul className="space-y-3">
                    {relatedBlogs.slice(0, 5).map((relatedBlog) => (
                      <li key={relatedBlog._id} className="flex justify-between items-center border-b pb-2">
                        <Link href={`/blogs/${relatedBlog.slug}`} className="text-sm text-gray-700 hover:text-orange-500">
                          {relatedBlog.title}
                        </Link>
                        <ArrowIcon size={14} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>No related blogs found.</p>
                    <p className="text-xs mt-1">Category: {blog.category}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Share in</h2>
                <div className="flex space-x-2">
                  {socialLinks.map((link, idx) => (
                    <a key={idx} href={link.link} className="hover:scale-110 transition-transform">
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>


        {/* Related blogs section */}
        {hasRelatedBlogs && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
            <TextHeader text="Related Blogs" align="left" size="large" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary blog display */}
              {primaryBlog && (
                <div className="lg:col-span-2 space-y-6">
                  <Link href={`/blogs/${primaryBlog.slug}`}>
                    <div className="aspect-video cursor-pointer">
                      <ImageDisplay
                        src={primaryBlog.imageUrl}
                        variant="rectangle"
                        title={primaryBlog.title}
                        description={primaryBlog.subtitle}
                      />
                    </div>
                    <div className="py-4">
                      <h2 className="text-xl font-bold">{primaryBlog.subtitle}</h2>
                      <TextDescription text={primaryBlog.description} className="mt-2 line-clamp-5" />
                    </div>
                  </Link>
                </div>
              )}

              {/* Secondary blogs display */}
              {secondaryBlogs.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {secondaryBlogs.map((card) => (
                    <Link key={card._id} href={`/blogs/${card.slug}`}>
                      <div className="space-y-2 cursor-pointer">
                        <ImageDisplay
                          src={card.imageUrl}
                          variant="smallrectangle"
                          title={card.subtitle}
                          description={card.description}
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{card.title}</h3>
                          <TextDescription text={card.description} className="line-clamp-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="lg:col-span-1 flex items-center justify-center text-gray-500">
                  <p className="text-center">Only one related blog available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error in blog page:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Blog</h1>
        <p className="text-gray-600">There was an error loading this blog post. Please try again later.</p>
        <Link href="/blogs" className="text-blue-600 hover:underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }
}