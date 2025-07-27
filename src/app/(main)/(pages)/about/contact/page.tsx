import React from "react";
import { fetchAPI } from "@/utils/apiService";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ContactDetails from "@/components/organisms/ContactDetails";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import ContactForm from "@/components/organisms/Form/Contactform";
import { ContactInfo } from "@/types";

const socialLinks = [
  {
    icon: <FaFacebookF className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5 " />,
    link: "https://www.facebook.com/FusionExpeditions",
  },
  {
    icon: <FaInstagram className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5" />,
    link: "https://www.instagram.com/fusionexpeditions/",
  },
  {
    icon: <FaYoutube className="text-white backdrop-blur-[12.6px] border border-white/16 bg-white/15 p-2 rounded-xl w-9.5 h-9.5 " />,
    link: "#",
  },
];

export default async function Contact() {
  // ✅ Fetch hero banner data
  const herosectiondata = await fetchAPI({ endpoint: "herobanner/contact" });

  // ✅ Fetch contact info
  const contactInfoRes = await fetchAPI({ endpoint: "info" });
  const contactInfo: ContactInfo = contactInfoRes.data;

  return (
    <>
      <Breadcrumb currentnavlink="About/Contact" />
      <HeroBanner herodata={herosectiondata.data} />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-20">
        {/* First Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center w-full">
          {/* Left Content */}
          <div className="w-full lg:w-auto max-w-[550px]">
            <TextHeader
              text="Get in Touch"
              align="left"
              size="large"
              width="auto"
              textcolor="black"
            />
            <TextDescription
              text="We’d love to hear from you! Whether you have a question, feedback, or a project in mind — feel free to reach out."
              className="text-[#535556] mb-10"
            />
            <ContactDetails contactInfo={contactInfo} />
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-auto flex justify-end mt-10 lg:mt-0">
            <Image
              src="/images/contactphoto.png"
              alt="Hikers on a trail"
              width={600}
              height={500}
              className="w-full max-w-md sm:max-w-[520px] h-[420px] rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Second Section */}
        <section className="flex flex-col md:flex-row gap-0 md:gap-10 lg:gap-10">
          {/* Left: Contact Form */}
          <div className="w-full md:w-[516px]">
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

          {/* Right: Conversation Prompt */}
          <div className="py-8 md:py-25 mt-4">
            <TextHeader
              text="Let's Start a Conversation"
              align="left"
              size="large"
              width="auto"
              textcolor="black"
              className="font-semi-bold mb-2 md:mb-4 lg:mb-4"
            />
            <TextDescription
              text="Have a question, idea, or just want to say hello? We’re here to help! Fill out the form and one of our team members will get back to you as soon as possible."
              className="text-[#535556] font-base max-w-xl mb-4 md:mb-6 lg:mb-6"
            />

            {/* Message Info Box */}
            <div className="inline-flex items-center gap-2 border border-[#0C2A34] px-2 py-2 rounded-lg bg-white">
              <Image
                src="/images/message.svg"
                alt="message icon"
                width={39}
                height={39}
                className="w-[39px] h-[39px]"
              />
              <span className="text-base sm:text-xl font-medium text-[#1A1E21] opacity-[60%]">
                We usually respond within 24 hours.
              </span>
            </div>

            {/* Social Links */}
            <div className="flex flex-col mt-8">
              <h1 className="font-bold text-2xl mb-3">Follow Us</h1>
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <div className="w-full h-[400px] sm:h-[500px] mt-5 md:mt-20 lg:mt-20">
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
  );
}
