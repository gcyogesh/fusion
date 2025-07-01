import { notFound } from "next/navigation";
import { fetchAPI } from "@/utils/apiService";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import ArrowIcon from "@/components/atoms/arrowIcon";

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
  "Great Value For Your Money: And finally comes a matter of Money! Nepal was named the world's 'best value destination' by Lonely Planet in 2017, because it's easy to explore this beautiful, culturally rich country on a budget. Nepalese cuisine, from Dal Bhat (rice with lentil soup and curry) to Momos (vegetables or meat dumplings), is known for its delicacy and affordability, although some fancy restaurants in Kathmandu might be expensive as costs are creeping up in the Kathmandu Valley like every other Metropolis. Public transportation is generally good and inexpensive. According to individual's preferences, there are plenty of options for accommodations from budget Hotels/ hostels to luxuries star Hotels and entry fees for the heritage sites are also reasonable. If you're a budget traveler and can adjust with basic facilities, $30-50 a day will be enough for you to explore Nepal comfortably.",
];

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    console.log('Fetching blog with slug:', params.slug);
    
    // ✅ Fixed: Use the slug parameter correctly
    const blogdata = await fetchAPI({ 
      endpoint: "blogs", 
      slug: params.slug 
    });

    console.log('Blog data received:', blogdata);

    if (!blogdata || !blogdata.success || !blogdata.data) {
      console.log('Blog not found or invalid response');
      notFound();
    }

    // ✅ Fixed: Get related blogs using the blog's category ID
    let relatedBlogs = [];
    try {
      if (blogdata.data.category) {
        console.log('Fetching related blogs for category:', blogdata.data.category);
        const relatedData = await fetchAPI({ 
          endpoint: "blogs/category", 
          slug: blogdata.data.category 
        });
        relatedBlogs = relatedData?.data || [];
        console.log('Related blogs found:', relatedBlogs.length);
      }
    } catch (error) {
      console.warn('Could not fetch related blogs:', error);
      // Continue without related blogs
    }

    const hasPrimaryBlog = relatedBlogs.length > 0;
    const secondaryBlogs = relatedBlogs.slice(1, 3);

    return (
      <section>
        <div className="mx-auto max-w-7xl py-18 flex flex-col md:flex-row justify-between gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-[860px]">
            <TextHeader
              text={blogdata.data.subtitle}
              align="left"
              size="large"
              width={855}
              className="w-[815px] h-auto"
            />
            <TextDescription text={blogdata.data.description} className="text-[#535556]" />

            {/* Quick Facts Section */}
            <section>
              <div className="border border-gray-300 rounded-md p-6 bg-white shadow-sm mb-4">
                <TextHeader
                  text="Quick Facts about Nepal"
                  align="left"
                  size="large"
                  width={855}
                  className="w-[815px] h-auto mb-2"
                />
                <ul className="list-disc list-inside text-base text-[#535556] space-y-2 pl-2">
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
            </section>

            <section>
              <ImageDisplay
                src={blogdata.data.imageUrl}
                variant="rectangle"
                title={blogdata.data.title}
                description={blogdata.data.subtitle}
              />
            </section>

            <section>
              <TextHeader text="Why Visit Nepal?" align="left" size="large" width={855} className="w-[815px] h-auto" />
              <TextDescription text={intro} className="font-semibold text-[#535556]" />
              <TextDescription text={heading} className="font-semibold text-[#535556]" />
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-sm font-semibold text-[#535556] mt-2.5">{index + 1}.</div>
                  <TextDescription text={point} className="text-justify text-[#535556]" />
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <div className="w-auto">
            <div className="sticky top-24">
              <TextHeader text="Related Blogs" align="left" size="large" width={300} className="mb-2 text-[#1A1E21]" />
              <div className="border p-4 rounded-2xl shadow-md bg-white w-[325px] h-auto mb-2">
                {relatedBlogs.length > 0 ? (
                  <ul className="space-y-3">
                    {relatedBlogs.slice(0, 5).map((blog) => (
                      <li key={blog._id || blog.id} className="flex justify-between items-center border-b pb-2">
                        {/* ✅ Fixed: Use blog.slug instead of blog.title */}
                        <Link href={`/blogs/${blog.slug}`} className="text-sm text-gray-700 hover:text-orange-500">
                          {blog.title}
                        </Link>
                        <ArrowIcon size={14} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No related blogs found.</p>
                )}
              </div>

              {/* Share Section */}
              <div className="flex flex-row justify-between items-center border p-4 rounded-xl shadow-md bg-white">
                <h1 className="text-2xl font-semibold text-gray-800">Share in</h1>
                <div className="flex space-x-2">
                  {socialLinks.map((link, index) => (
                    <a key={index} href={link.link} className="hover:scale-110 transition-transform">
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs Section */}
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
              <div className="lg:col-span-2 flex flex-col">
                <Link href={`/blogs/${relatedBlogs[0].slug}`}>
                  <div className="aspect-video w-full cursor-pointer">
                    <ImageDisplay
                      src={relatedBlogs[0].imageUrl}
                      variant="rectangle"
                      title={relatedBlogs[0].title}
                      description={relatedBlogs[0].subtitle}
                    />
                  </div>
                  <div className="mt-3">
                    <h1 className="text-xl font-bold">{relatedBlogs[0].subtitle}</h1>
                    <TextDescription text={relatedBlogs[0].description} className="mt-2 line-clamp-5" />
                  </div>
                </Link>
              </div>

              <div className="flex flex-col gap-y-[25px]">
                {secondaryBlogs.map((card) => (
                  <Link href={`/blogs/${card.slug}`} key={card._id || card.id}>
                    <div className="flex flex-col cursor-pointer">
                      <ImageDisplay
                        src={card.imageUrl}
                        variant="smallrectangle"
                        title={card.subtitle}
                        description={card.description}
                      
                      />
                      <div className="mt-4 h-[150px]">
                        <h1 className="text-lg font-semibold">{card.title}</h1>
                        <TextDescription text={card.description} className="text-justify line-clamp-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>
    );
  } catch (error) {
    console.error('Error in blog page:', error);
    
    // Return error UI instead of throwing
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Blog</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading this blog post. Please try again later.
          </p>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }
}