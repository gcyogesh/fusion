import Image from "next/image";
import { FaInstagram, FaFacebookF, FaYoutube, FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import Logo from "@/components/atoms/Logo";
import ContactDetails from "../ContactDetails";

const socialLinks = [
  { Icon: FaInstagram, link: "#", label: "Instagram" },
  { Icon: FaFacebookF, link: "#", label: "Facebook" },
  { Icon: FaYoutube, link: "#", label: "YouTube" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Destinations", href: "/destinations" },
  { label: "Activities", href: "/activities" },
  { label: "Terms and Conditions", href: "/about/terms" },
];



const overviewLinks = [
  { label: "Deals", href: "/deals" },
  { label: "Duration", href: "/duration" },
  { label: "Blog", href: "/blogs" },
  { label: "Reviews", href: "/about/reviews" },
 
];



interface FooterProps {
  destinations?: any[];
  activities?: any[];
}

export default function Footer({ destinations = [], activities = [] , ContactInfo =[]}: FooterProps) {
  return (
    <footer className="bg-gradient-to-t from-[#85cdf4] to-[#F5F5F5]">
      <Image
        src="/images/footerTopImage.png"
        width={1200}
        height={200}
        alt="Scenic background"
        className="w-full h-auto object-cover"
      />

      <div className="bg-gradient-to-t from-[#e2f1fc] to-[#bee3f9]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-6 py-10">
          {/* Left Section */}
          <div className="w-full lg:w-4/12 flex flex-col space-y-6">
            {/* Logo */}
            <div className="w-[150px] md:w-[180px]">
              <Logo index={1}/>
            </div>

            {/* Newsletter */}
            <div className="space-y-1">
              <div className="mb-6 mt-5">
                <h1 className="text-3xl font-bold">Newsletter</h1>
                <p className="text-base leading-relaxed pr-6">
                  To receive tour packages, news, updates, departures and offers via email.
                </p>
              </div>
              <div className="w-[300px] md:w-[356px] pt-1 pr-1 pb-1 mt-2 bg-white border border-black rounded-xl">
                <div className="flex bg-white rounded-xl">
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="w-full px-4 py-2 text-sm border-none focus:outline-none placeholder-gray-400"
                  />
                  <button className="bg-primary hover:bg-green-500 text-white text-base px-4 rounded-md">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="font-bold text-xl mb-3">Find us on social</p>
              <div className="flex space-x-2">
                {socialLinks.map(({ Icon, link, label }, index) => (
                  <a
                    key={index}
                    href={link}
                    aria-label={label}
                    className="bg-primary text-white p-2 rounded-xl w-10 h-10 flex justify-center items-center hover:scale-110 transition-transform"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Company Links */}
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-semibold">Company</h1>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-[#06ab86] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-semibold">Overview</h1>
              <ul className="space-y-3">
               {overviewLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-[#06ab86] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details & Payment */}
            <div className="flex flex-col space-y-4">
              
              <h1 className="text-2xl font-semibold">Contact Detail</h1>
                 <ContactDetails showDivider={false} />

              <div className="mt-6">
                <p className="text-2xl font-bold">We Accept</p>
                <div className="flex gap-4 mt-2">
                  <FaCcVisa className="w-[80px] h-[80px] text-[#1A1F71]" aria-label="Visa" />
                  <FaCcMastercard className="w-[80px] h-[80px] text-[#EB001B]" aria-label="Mastercard" />
                  <FaCcAmex className="w-[80px] h-[80px] text-[#2E77BC]" aria-label="Amex" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-7xl mx-auto border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-6">
            <div className="flex gap-6 text-sm">
              <p>Â© 2025 Fusion Expeditions</p>
              <a href="/about/terms" className="hover:text-[#06ab86]">Terms and Conditions</a>
              <a href="/site-map" className="hover:text-[#06ab86]">Site Map</a>
            </div>
            <a href="https://lishnutech.com/" target="blank" className="text-sm mt-4 md:mt-0">
              Designed & Develoaed by: Lishnu Tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}