import Image from "next/image";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import TopCategoriesSection from "@/components/molecules/TopCategoriesSection";
import ValuesSection from "@/components/molecules/ValueSection";
import Breadcrumb from "@/components/atoms/breadcrumb";
import PartnerSection from "@/components/organisms/partners";
import ImageDisplay from "@/components/atoms/ImageCard";



export default async function About() {
  const herodata = await fetchAPI({ endpoint: "herobanner/about" });
  const partnersdata = await fetchAPI({ endpoint: "partners" });

 const teamsdata = await fetchAPI({ endpoint: "teams" });

const profile = teamsdata.data;
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
            className="text-[#535556] w-full max-w-[530px] h-auto font-semibold mt-4"
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

{/* MISSION & VISION SECTION */}
<section className="bg-[#0e334f] w-full h-auto py-2 md:py-12">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-1 md:gap-8 px-4">
    
    {/* MISSION */}
    <div className="relative w-full max-w-[570px]">
      
      
      <Image
        src="/images/Mission.svg"
        alt="Hikers on a trail"
        width={561}
        height={325}
        className="w-full h-auto" // hide on small, show on sm+
      />
      
      <div className="absolute inset-0 h-auto md:h-[200px] w-full mt-0 md:mt-20 p-5">
        <TextHeader
          text="Adventure with a Purpose"
          specialWordsIndices=""
          align="left"
          size="large"
          width="auto"
          textcolor="white"
          buttonText="Our Mission"
        />
        <TextDescription
          text="Our mission is to uncover new touristic gems and craft thrilling, memory-rich experiences for adventure seekers across the globe. From adrenaline-pumping climbs to serene cultural walks — we cater to all."
          className="text-white w-auto md:w-[550px]"
        />
      </div>
    </div>

    {/* VISION */}
    <div className="relative w-full max-w-[560px]">
      
      <Image
        src="/images/Mission.svg"
        alt="Hikers on a trail"
        width={561}
        height={325}
        className="w-full h-auto " 
      />
     
      <div className="absolute inset-0 h-full md:h-[200px] w-full mt-4 md:mt-20 p-6">
        
        <TextHeader
          text="Inspiring Transformative Travel"
          specialWordsIndices=""
          align="left"
          size="large"
          width="auto"
          textcolor="white"
          buttonText="Our Vision"
        />
        
        <TextDescription
          text=" To become a leading name in sustainable and immersive travel experiences in Nepal — where every journey fosters deep cultural connection, environmental respect, and unforgettable discovery."
          className="text-white w-auto md:w-[550px]"
        />
      </div>
    </div>

  </div>
</section>


{/* VALUES SECTION */}
<ValuesSection />

{/* TEAM SECTION */}
<section className="max-w-7xl mx-auto px-4">
  <div className="flex flex-col py-10 text-center">
    <TextHeader
      text="Fusion Expeditions – Crafted in the Heart of Nepal"
      specialWordsIndices=""
      align="center"
      size="large"
      width="420px"
      textcolor="Black"
      buttonText="Company Overview"
    />
    <TextDescription
      text="Short bios or rotating carousel of your expert guides, local partners..."
      className="text-[#535556] w-full max-w-[420px] mx-auto"
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
    {profile.map((item, index) => (
      <div key={index} className="text-center relative mb-12 w-full max-w-[300px]">
        <div className="bg-gradient-to-b from-[#D4E7EA] to-[#1891D1] h-[370px] w-[300px] rounded-[80px] overflow-hidden flex items-center justify-center mx-auto">
          <Image
            src={item.image}
            alt="profile"
            fill
            className="border rounded-4xl object-cover"
          />
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-orange-400 w-[210px] h-[60px] px-4 py-2 rounded-full text-white font-semibold text-sm shadow-md">
          <h1 className="font-bold text-base">{item.name}</h1>
          <h1 className="font-semibold text-sm opacity-80">{item.position}</h1>
        </div>
      </div>
    ))}
  </div>
</section>


     


    </>
  );
}
