import Image from "next/image";

import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import Logo from "@/components/atoms/Logo";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import ContactDetails from "../ContactDetails";
const socialLinks = [
  { icon: <FaInstagram className="text-white bg-[#F7941D] p-2 rounded-xl w-10 h-10"/>, link: "#" },
  { icon: <FaFacebookF className="text-white bg-[#F7941D] p-2 rounded-xl w-10 h-10"/>, link: "#" },
  { icon: <FaYoutube className="text-white bg-[#F7941D] p-2 rounded-xl w-10 h-10"/>, link: "#" },
];

const destinations = [
  "Everest-Region",
  "Annapurna-Region",
  "Kangchenjunga-Region",
  "Langtang-Region",
  "Manaslu-Region",
  "Dolpa-Region",
];

const companyLinks = ["About Us", "Contact Us", "Blog", "Terms and Conditions"];



export default function Footer() {
  return (
    

<footer className="bg-gradient-to-t from-[#85cdf4] to-[#fef9ee]">
  <Image
    src="/images/footerTopImage.png"
    width={1200}
    height={200}
    alt="Footer Top Image"
    className="w-full h-auto object-cover"
  />

  <div className="bg-gradient-to-t from-[#e2f1fc] to-[#bee3f9]">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-6 py-10">
      
      {/* Left Section */}
      <div className="w-full lg:w-4/12 flex flex-col space-y-6  ">
        {/* Logo */}
        <div className="w-[150px] md:w-[180px]">
        
<Logo />        </div>

        {/* Newsletter */}
        <div className="space-y-1">
            <div className="mb-6 mt-5">
          <h3 className="text-3xl font-bold">Newsletter</h3>
          <p className="text-base leading-relaxed pr-6">
            To receive tour packages, news, updates, departures and offers via email.
          </p>
            </div>
          <div className=" w-[356px] pt-1 pr-1 pb-1 mt-2 bg-white  border border-black rounded-xl">
          <div className="flex pt-5px bg-white rounded-xl ">
          <input
            type="email"
           placeholder="Enter Your Email Address"
           className="w-full px-4 py-2 text-sm border-none focus:outline-none focus:ring-0 placeholder-gray-400"
           />
            <button className="  bg-[#F7941D] hover:bg-green-500 text-white text-sm px-4 rounded-md ">
              Subscribe
            </button>
          </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-6">
          <p className="font-bold text-xl mb-3">Find us on social</p>
          <div className="flex space-x-2">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.link} className="hover:scale-110 transition-transform">
                <span>{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-7/12  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Company */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((link, index) => (
              <li key={index}>
                <a href="#" className="hover:text-[#06ab86] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Destinations</h3>
          <ul className="space-y-3">
            {destinations.map((place, index) => (
              <li key={index}>
                <a href="#" className="hover:text-[#06ab86] transition-colors">{place}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Contact Detail</h3>
          <ul className="space-y-3">
            <ContactDetails showDivider={false}/>
        </ul>

          {/* Payment Logos */}
          <div className="mt-6 ">
            <p className="text-2xl font-bold">We Accept</p>
            <div className="flex gap-4 mt-2">
            <FaCcVisa className="w-[80px] h-[80px] text-[#1A1F71]" />
           <FaCcMastercard className="w-[80px] h-[80px] text-[#EB001B]" />
             <FaCcAmex className="w-[80px] h-[80px] text-[#2E77BC]" />
              {/* Payment logos can be added here 
              <Image src="/images/mc-logo-52.svg" alt="Mastercard" width={80} height={20} />
              <Image src="/images/visa .svg" alt="Visa" width={100} height={20} />
              <Image src="/images/american express.svg" alt="Amex" width={80} height={20} />
              */}
            </div>
          </div>
        </div>

      </div>

    </div>

    {/* Footer Bottom Bar */}
    <div className=" max-w-7xl mx-auto border-t border-gray-300 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-6">
        <div className="flex gap-6 text-sm">
          <p>© 2025 Fusion Expeditions</p>
          <a href="#" className="hover:text-[#06ab86]">Privacy Policy</a>
          <a href="#" className="hover:text-[#06ab86]">Site Map</a>
        </div>
        <p className="text-sm mt-4 md:mt-0">
          Designed & Developed by: Lishnu Tech
        </p>
      </div>
    </div>

  </div>
</footer>
  );
}