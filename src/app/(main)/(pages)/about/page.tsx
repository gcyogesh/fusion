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

      <section className="h-[580px]">
        <div className="relative top-1 max-w-7xl mx-auto ">
          <div className=" w-[1300px] h-[555px] bg-[#FEF2D6] rounded-3xl p-10 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-70 justify-center items-center">
              <div className="flex flex-col ">
                <TextHeader
                  text="Fusion Expeditions – Crafted in the Heart of Nepal"
                  specialWordsIndices=""
                  align="left"
                  size="large"
                  width="420px"
                  textcolor="Black"
                  buttonText="Company Overview"


                />

                <TextDescription text="Fusion Expeditions is a dynamic tour operator company based in the vibrant city of Kathmandu, Nepal. Established in 2017 by a group of seasoned travel professionals with nearly a decade of hands-on experience in the tourism industry,
     the company was born out of a shared passion for exploration and a deep love for the unparalleled beauty and cultural richness of Nepal. Our founders envisioned a travel company that would not only deliver exciting and authentic adventures but also foster meaningful connections between travelers and the places they visit."  className=" text-[#535556] w-[530px] h-[200px] font-semi-bold" />
              </div>

              <div className="w-full max-w-[500px]">
                {/* Top large image */}
                <div className=" mb-4 rounded-md overflow-hidden">
                  <Image
                    src="/images/About.png"
                    alt="Hikers on a trail"
                    width={450}
                    height={400}
                    className="w-[371px] h-auto  bg-amber-50"
                  />
                </div>

                {/* Bottom row: left stats box + right image */}
                <div className="grid grid-cols-2  ">
                  {/* Left: Experience Box */}
                  <div className="bg-orange-400 w-[174] h-[117] text-white flex flex-col justify-center items-center p-4 rounded-md text-center ml-5">
                    <p className="text-4xl font-bold leading-none">8+</p>
                    <p className="text-sm font-medium mt-1">Years Experience</p>
                  </div>

                  {/* Right: Selfie Image */}
                  <div className="rounded-md overflow-hidden">
                    <Image
                      src="/images/About1.png"
                      alt="Group of happy travelers"
                      width={250}
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

      <section className="bg-[#0e334f] w-full h-[504px]">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-center h-full  text-white gap-6">

          <div className="relative h-auto  ">
            <Image
              src="/images/Mission.svg"
              alt="Hikers on a trail"
              width={561}
              height={325}
              className="w-[560px] h-[325px] "
            />

            <div className="absolute inset-0  h-[200px] w-[580px] mt-20 p-6">
              <TextHeader
                text="Adventure with a Purpose"
                specialWordsIndices=""
                align="left"
                size="large"
                width="auto"
                textcolor="white"
                buttonText="Our Mission"
                className=""

              />

              <TextDescription text=" Our mission is to uncover new touristic gems and craft thrilling, memory-rich experiences for adventure seekers across the globe. From adrenaline-pumping climbs to serene cultural walks — we cater to all." className=" text-white " />
            </div>
          </div>

          <div className="relative h-auto  ">
            <Image
              src="/images/Mission.svg"
              alt="Hikers on a trail"
              width={561}
              height={325}
              className="w-[560px] h-[325px] "
            />

            <div className="absolute inset-0  h-[200px] w-[550px] mt-20 p-6">
              <TextHeader
                text="Inspiring Transformative Travel"
                specialWordsIndices=""
                align="left"
                size="large"
                width="auto"
                textcolor="white"
                buttonText="Our Vision"

              />

              <TextDescription text=" To become a leading name in sustainable and immersive travel experiences in Nepal — where every journey fosters deep cultural connection, environmental respect, and unforgettable discovery." className=" text-white " />
            </div>
          </div>
        </div>
      </section>

     
     
      <ValuesSection />
     

     <section className=" max-w-7xl mx-auto">
       <div className="flex flex-col py-10">
                <TextHeader
                  text="Fusion Expeditions – Crafted in the Heart of Nepal"
                  specialWordsIndices=""
                  align="center"
                  size="large"
                  width="420px"
                  textcolor="Black"
                  buttonText="Company Overview"


                />
               
                <TextDescription text="Short bios or rotating carousel of your expert guides, local partners, and past travelers sharing experiences."  className="text-[#535556] items-center text-center  w-[420px] mx-auto " />
                 
              </div>
              
            
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6  ">
  {profile.map((item, index) => (
    <div key={index} className="text-center relative mb-6">
      {/* Card Background */}
      <div className="bg-gradient-to-b from-[#D4E7EA] to-[#1891D1] h-[370px] w-[300px] rounded-[80px] overflow-hidden flex items-center justify-center  mx-auto">
        {/* Leader Image */}
       <Image
                             src={item.image}
                             alt="profile"
                             
                             fill
                             className="border rounded-4xl"
                           />
   
      </div>

      {/* Name & Role */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-orange-400 w-[210px] h-[60px] px-4 py-2 rounded-full text-white font-semibold text-sm shadow-md items-center ">
        <h1 className="font-bold text-base ">{item.name}</h1>
        <h1 className=" font-semibold text-sm opacity-[80%]">{item.position}</h1>
      </div>
    </div>
  ))}
</div>


     </section>
     

     


    </>
  );
}
