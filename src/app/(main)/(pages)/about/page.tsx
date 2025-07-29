import Image from "next/image";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import ValuesSection from "@/components/molecules/ValueSection";
import Breadcrumb from "@/components/atoms/breadcrumb";

export default async function About() {
  const herodata = await fetchAPI({ endpoint: "herobanner/about" });
  const partnersdata = await fetchAPI({ endpoint: "partners" });

  return (
    <>
      <Breadcrumb currentnavlink="About" />
      <HeroBanner herodata={herodata.data} />

      <section className="h-auto px-4 sm:px-6 sm:py-2 md:py-10">
        <div className="relative top-0 md:top-10 lg:top-10 max-w-7xl mx-auto">
          <div className="w-full md:w-[1300px] h-auto md:h-[555px] bg-[#FEF2D6] rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-20 items-center justify-center">
              <div className="flex flex-col justify-center items-start">
                <TextHeader
                  text="Fusion Expeditions – Crafted in the Heart of Nepal"
                  specialWordsIndices=""
                  align="left"
                  size="large"
                  width="100%"
                  textcolor="Black"
                  buttonText="Company Overview"
                  className="mb-2"
                />
                <TextDescription
                  text="Fusion Expeditions is a dynamic tour operator company based in the vibrant city of Kathmandu, Nepal. Established in 2017 by a group of seasoned travel professionals with nearly a decade of hands-on experience in the tourism industry, the company was born out of a shared passion for exploration and a deep love for the unparalleled beauty and cultural richness of Nepal. Our founders envisioned a travel company that would not only deliver exciting and authentic adventures but also foster meaningful connections between travelers and the places they visit."
                  className="text-[#535556] w-full max-w-[530px] h-auto font-semibold "
                />
              </div>

              <div className="w-full max-w-[500px] mx-auto">
                <div className="mb-4 rounded-md overflow-hidden flex justify-center">
                  <Image
                    src="/images/About.png"
                    alt="Hikers on a trail"
                    width={450}
                    height={400}
                    className="w-full max-w-[371px] h-auto bg-amber-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-400 w-full h-[117px] text-white flex flex-col justify-center items-center p-4 rounded-md text-center">
                    <p className="text-4xl font-bold leading-none">8+</p>
                    <p className="text-sm font-medium mt-1">Years Experience</p>
                  </div>
                  <div className="rounded-md overflow-hidden">
                    <Image
                      src="/images/About1.png"
                      alt="Group of happy travelers"
                      width={260}
                      height={200}
                      className="w-full h-auto object-cover bg-amber-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  <section className="bg-[#0e334f] w-full py-6 sm:py-8 md:py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Mission */}
      <div className="relative w-full max-w-full group">
        {/* Image - Only for tablets and up */}
        <div className="hidden sm:block">
          <Image
            src="/images/Mission.svg"
            alt="Adventure seekers on their journey"
            width={561}
            height={325}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>

        {/* Content Overlay for large screen / Normal for small */}
        <div className="sm:absolute sm:inset-0 sm:bg-black/40 bg-white/10  rounded-lg sm:rounded-none sm:backdrop-blur-none backdrop-blur-sm">
          <div className="h-full flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <TextHeader
              text="Adventure with a Purpose"
              specialWordsIndices=""
              align="left"
              size="large"
              width="auto"
              textcolor="white"
              buttonText="Our Mission"
            />
            <div className="mt-3 sm:mt-4">
              <TextDescription
                text="Our mission is to uncover new touristic gems and craft thrilling, memory-rich experiences for adventure seekers across the globe. From adrenaline-pumping climbs to serene cultural walks — we cater to all."
                className="text-white text-sm sm:text-base leading-relaxed max-w-full sm:max-w-[480px] md:max-w-[520px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="relative w-full max-w-full group">
        {/* Image - Only for tablets and up */}
        <div className="hidden sm:block">
          <Image
            src="/images/Vision.svg"
            alt="Sustainable travel and cultural connection"
            width={561}
            height={325}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>

        {/* Content */}
        <div className="sm:absolute sm:inset-0 sm:bg-black/40 bg-white/10  rounded-lg sm:rounded-none sm:backdrop-blur-none backdrop-blur-sm">
          <div className="h-full flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <TextHeader
              text="Inspiring Transformative Travel"
              specialWordsIndices=""
              align="left"
              size="large"
              width="auto"
              textcolor="white"
              buttonText="Our Vision"
            />
            <div className="mt-3 sm:mt-4">
              <TextDescription
                text="To become a leading name in sustainable and immersive travel experiences in Nepal — where every journey fosters deep cultural connection, environmental respect, and unforgettable discovery."
                className="text-white text-sm sm:text-base leading-relaxed max-w-full sm:max-w-[480px] md:max-w-[520px]"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


      {/* VALUES SECTION */}
      <ValuesSection />
    </>
  );
}
