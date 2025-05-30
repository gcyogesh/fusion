import React from "react";
import { fetchAPI } from "@/utils/apiService";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ContactDetails from "@/components/organisms/ContactDetails";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import ContactForm from "@/components/organisms/Form";

const socialLinks = [
  { icon: <FaInstagram className="text-white bg-primary p-2 rounded-xl w-8 h-8"/>, link: "#" },
  { icon: <FaFacebookF className="text-white bg-primary p-2 rounded-xl w-8 h-8"/>, link: "#" },
  { icon: <FaYoutube className="text-white bg-primary p-2 rounded-xl w-8 h-8"/>, link: "#" },
];

export default async function contact() {
const herosectiondata = await fetchAPI({ endpoint: "herobanner/contact" });
  return (
    <>


        <Breadcrumb currentnavlink="Contact" />
      <HeroBanner herodata={herosectiondata.data} />
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


        <section>
          <div className="grid grid-cols-2  max-w-full px-12 ">
          {/* Left Side form */}
          <div>
          <TextHeader
              text="Leave a quick message"
              align="left"
              size="large"
              width="auto"
              textcolor="black"
              className="mb-2"
            />
          <ContactForm />
          </div>
         <div className=" py-26">
            <TextHeader
              text="Let's Start a Conversation"
              align="left"
              size="large"
              width="auto"
              textcolor="black"
              className="font-semi-bold"
            />
            <TextDescription text=" Have a question, idea, or just want to say hello? We’re here to help! Fill out the form and one of our team members will get back to you as soon as possible." className=" text-[#535556] font-base w-[495px] mb-15" />

             <div className="inline-flex items-center gap-2 border border-[#0C2A34]  px-2 py-1 rounded-lg  bg-white ">
           <Image
                      src="/images/message.svg"
                      alt="message icon"
                      width={8}
                      height={8}
                      className="w-[39px] h-[39px]"
                    />
          <span className="text-xl font-medium text-[#1A1E21] opacity-[60%]">We usually respond within 24 hours.</span>
          </div>
          <div className="flex flex-col justify-between  mt-8">
            <h1 className="font-bold text-2xl mb-3">Follow Us</h1>
            <div className="flex space-x-2 mt-auto">
    {socialLinks.map((link, index) => (
      <a key={index} href={link.link} className="hover:scale-110 transition-transform">
        <span>{link.icon}</span>
      </a>
    ))}
    </div>
    
  </div>
            </div>

          

          </div>
        </section>
  
          {/* Google Map Section */}  



        <div className="w-full h-[500px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.995845205694!2d85.30639871127741!3d27.715205525045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19fd47a09885%3A0x901169afffa90a51!2sFUSION%20EXPEDITIONS!5e1!3m2!1sen!2snp!4v1748602032280!5m2!1sen!2snp" 
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