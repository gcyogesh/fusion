import React from "react";

import Image from "next/image";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ContactDetails from "@/components/organisms/ContactDetails";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";

export default async function contact() {

  return (
    <>


        <Breadcrumb currentnavlink="Contact" />
      
      <div className="mx-auto max-w-7xl py-20 ">
       <section>
        <div className="grid grid-cols-2 items-center max-w-full">

          {/* Left Content */}
          <div>
            <TextHeader
              text="Get in Touch"
              align="left"
              size="large"
              width="auto"
              textcolor="black"
            />
            <TextDescription text=" We’d love to hear from you! Whether you have a question, feedback, or a project in mind — feel free to reach out." className=" text-[#535556] w-[515px] mb-10" />
            <ContactDetails />
          </div>

          {/* Right Side Image */}
          <div className="w-full flex flex-row justify-center ">
            <Image
              src="/images/contactImage.png"
              alt="Hikers on a trail"
              width={600}
              height={500}
              className="w-[515px] h-[415px] rounded-2xl"
            />
          </div>
        </div>
        </section>
  
          {/* Google Map Section */}  



        <div className="w-full h-[500px]">
          <iframe
            src="https://www.google.com/maps"
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  )



}