import Image from "next/image";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";

import TopCategoriesSection from "@/components/molecules/TopCategoriesSection/tourcategories";



export default async function About() {
  const herodata = await fetchAPI({ endpoint: "herobanner/about" });




  return (
    <>

      <HeroBanner herodata={herodata.data} />

      <section>
        <div className="max-w-7xl mx-auto">
          <div className=" w-[1300px] h-[600px] bg-[#FEF2D6] rounded-3xl p-10 ">
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

              <div className="w-full max-w-[500px] bg-white p-4 rounded-md shadow-sm">
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
      
    />
    
    <TextDescription text=" Our mission is to uncover new touristic gems and craft thrilling, memory-rich experiences for adventure seekers across the globe. From adrenaline-pumping climbs to serene cultural walks — we cater to all."  className=" text-white " />
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
    
    <TextDescription text=" To become a leading name in sustainable and immersive travel experiences in Nepal — where every journey fosters deep cultural connection, environmental respect, and unforgettable discovery."  className=" text-white " />
              </div>
   </div>
          </div>
      </section>

      <TopCategoriesSection
      buttonText="What We Offer"
    />
    


    </>
  );
}
