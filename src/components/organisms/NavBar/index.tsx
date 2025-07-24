"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { ChevronDown, ChevronUp, ChevronRight, CloudCog } from "lucide-react";

import Logo from "@/components/atoms/Logo";
import MobileDropdownMenu from "./dropdowns/mobiledropdown";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";
import { Destination, TourPackage, Activity, ContactInfo, Duration } from "@/types";

type NavLink = {
  name: string;
  href: string;
  hasDropdown: boolean;
  subLinks?: {
    name: string;
    href: string;
    subtitle?: string;
    image?: string;
    title?: string;
    relatedPackages?: {
      duration: any;
      name: string;
      href: string;
      title?: string;
    }[];
  }[];
};

interface NavbarProps {
  destinations: Destination[];
  activities: Activity[];
  relatedPackagesMap: { [slug: string]: TourPackage[] };
  relatedActivityPackagesMap: { [slug: string]: TourPackage[] };
  relatedDurationPackagesMap: { [slug: string]: TourPackage[] };
  contactInfo: ContactInfo;
  durationGroups: Duration[];
}

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default function Navbar({
  destinations = [],
  activities = [],
  durationGroups = [],
  relatedPackagesMap = {},
  relatedActivityPackagesMap = {},
  relatedDurationPackagesMap = {},
  contactInfo,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavLink | null>(null);
  const [hoveredSub, setHoveredSub] = useState<NavLink["subLinks"][0] | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const logoIndex = useMemo(() => {

    if (pathname === "/" && scrollY === 0) {
      return 1;
    }
  
    return 0;
  }, [pathname, scrollY]);

  const navLinks = useMemo(() => {
    const formattedActivities = activities.map((item) => ({
      name: item.name || item.title || "Unknown Activity",
      href: `/activities/${item.slug}`,
      subtitle: item.subtitle || `Explore ${item.title} activities`,
      title: item.title,
      image: item.image || item.imageUrls?.[0] || "",
      relatedPackages: (relatedActivityPackagesMap[item.slug] || []).map((pkg) => ({
        name: pkg.title,
        href: `/itinerary/${pkg._id}`,
        duration: `${pkg.duration?.days || 0} Days`,
        title: pkg.title,
      })),
    }));

    const formattedDestinations = destinations.map((item) => ({
      name: item.title,
      href: `/destinations/${item.slug}`,
      subtitle: item.subtitle || `Explore ${item.title} destinations`,
      title: item.title,
      image: item.imageUrls?.[0] || item.image || "",
      relatedPackages: (relatedPackagesMap[item.slug] || []).map((pkg) => ({
        name: pkg.title,
        href: `/itinerary/${pkg._id}`,
        duration: `${pkg.duration?.days || 0} Days`,
        title: pkg.title,
      })),
    }));

    const formattedDurations = durationGroups.map((item) => ({
      name: item.label,
      href: `/duration/${item.slug}`,
      subtitle: item.description,
      title: item.label,
      image: item.image,
      relatedPackages: (relatedDurationPackagesMap[item.slug] || []).map((pkg) => ({
        name: pkg.title,
        href: `/itinerary/${pkg._id}`,
        duration: `${pkg.duration?.days || 0} Days`,
        title: pkg.title,
      })),
    }));

    return [
      {
        name: "Destinations",
        href: "/destinations",
        hasDropdown: true,
        subLinks: formattedDestinations,
      },
      {
        name: "Activities",
        href: "/activities",
        hasDropdown: true,
        subLinks: formattedActivities,
      },
      {
        name: "Duration",
        href: "/duration",
        hasDropdown: true,
        subLinks: formattedDurations,
      },
      { name: "Blogs", href: "/blogs", hasDropdown: false },
      {
        name: "About",
        href: "/about",
        hasDropdown: true,
        subLinks: [
          {
            name: "Our Teams",
            href: "/about/ourteams",
            subtitle: "Meet the passionate people behind our mission",
            title: "Our Teams",
          },
          {
            name: "Fusion",
            href: "/about",
            subtitle: "Explore our story, values, and what drives us forward",
            title: "Fusion",
          },
          {
            name: "Contact",
            href: "/about/contact",
            subtitle: "We'd love to hear from you!",
            title: "Contact",
          },
          {
            name: "Testimonials",
            href: "/about/reviews",
            subtitle: "Feedback from our clients",
            title: "Reviews",
          },
          {
            name: "Terms and Conditions",
            href: "/about/terms",
            subtitle: "Read our policies",
            title: "Terms and Conditions",
          },
        ],
      },
      { name: "Deals", href: "/deals", hasDropdown: false },
    ];
  }, [activities, destinations, durationGroups, relatedActivityPackagesMap, relatedPackagesMap, relatedDurationPackagesMap]);

  const navbarClasses = useMemo(() => {
    const base = "fixed top-0 left-0 w-full z-60 px-2 transition-all duration-300 ease-linear";
    const visibility = showNavbar ? "translate-y-0" : "-translate-y-full";
    const theme =
      pathname === "/" && scrollY === 0
        ? "blur-base bg-white/20 text-white shadow-lg"
        : "bg-[#0e334f] text-white";

    return `${base} ${visibility} ${theme}`;
  }, [showNavbar, pathname, scrollY]);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);

        if (currentScrollY === 0) {
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }

        setLastScrollY(currentScrollY);
      }, 100),
    [lastScrollY]
  );

  const handleMouseEnter = useCallback(
    (link: NavLink) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (link.hasDropdown) {
        setActiveDropdown(link);
        setHoveredSub(link.subLinks?.[0] || null);
      }
    },
    [hoverTimeout]
  );

  const handleMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => closeDropdown(), 150);
    setHoverTimeout(timeout);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
    setHoveredSub(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  }, [hoverTimeout]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuItemClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    closeDropdown();
  }, [pathname, closeDropdown]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [handleScroll, hoverTimeout]);

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4 h-15 md:h-18 lg:h-20">
        <Link href="/" className="cursor-pointer">
          <Logo index={logoIndex} />
        </Link>

        <ul className="relative hidden md:flex gap-8 font-medium text-base">
          {navLinks.map((link) => (
            <li
              key={link.name}
              onMouseEnter={() => handleMouseEnter(link)}
              className="relative group flex items-center gap-1 hover:text-[#F28A15] transition-colors"
            >
              <Link href={link.href} className="">
                {link.name}
              </Link>
              {link.hasDropdown &&
                (activeDropdown?.name === link.name ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </li>
          ))}
        </ul>

        {/* Contact Icons */}
        <div className="flex items-center gap-4">
          {contactInfo?.whatsappNumber && (
            <Link
              href={`https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-white text-3xl hover:text-green-400" />
            </Link>
          )}
          {contactInfo?.socialLinks?.instagram && (
            <Link
              href={contactInfo.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hidden md:block"
            >
              <FaInstagram className="text-white text-3xl hover:text-pink-500" />
            </Link>
          )}
          {contactInfo?.socialLinks?.facebook && (
            <Link
              href={contactInfo.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hidden md:block"
            >
              <FaFacebook className="text-white text-3xl hover:text-blue-500" />
            </Link>
          )}
          <button onClick={toggleMenu} className="text-3xl md:hidden" aria-label="Toggle menu">
            {isMenuOpen ? <IoMdClose /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Desktop Dropdown */}
      {activeDropdown && (
        <div className="absolute top-[80px] left-0 w-full text-black z-50 hidden md:block" onMouseLeave={handleMouseLeave}>
          <div className="max-w-6xl mx-auto flex bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 px-8">
            <div className="w-[300px] text-base px-4 py-6 ">
              <ul className="divide-y divide-gray-200 ">
                {activeDropdown.subLinks?.map((sub, index) => (
                  <li key={`${sub.name}-${index}`} onMouseEnter={() => setHoveredSub(sub)} >
                    <Link
                      href={sub.href}
                      className={`flex justify-between items-center px-5 py-3  ${
                        hoveredSub?.name === sub.name ? "bg-primary  text-white" : "text-gray-400"
                      }`}
                    >
                       <span className={`text-sm font-medium ${
      hoveredSub?.name === sub.name ? "text-white" : "text-gray-800 hover:text-white"
    }`}>
      {sub.name || sub.title || "Unknown"}
    </span>
                      <ChevronRight size={16} className={hoveredSub?.name === sub.name ? "text-white" : "text-gray-400"} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-[1px] h-auto my-6 bg-gray-300 m-8" />
            <div className="flex-1 px-4 py-6 flex gap-6 items-start">
              <div className="flex-1">
                <TextHeader text={hoveredSub?.name || hoveredSub?.title} align="left" size="small" />
                {hoveredSub?.relatedPackages?.length ? (
                  <ul className="mt-4 space-y-1 text-gray-700 font-medium text-base divide-y divide-gray-200">
                    {hoveredSub?.relatedPackages.map((pkg, idx) => (
                      <li key={idx} className="py-1">
                        <Link href={pkg.href} className="hover:text-[#f28a15] ">
                          {pkg?.name} - {pkg?.duration}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  (activeDropdown.name === "Destinations" || activeDropdown.name === "Activities") && (
                    <p className="text-sm text-gray-500 italic mt-4">No related packages available</p>
                  )
                )}
              </div>
              {hoveredSub?.image && (
                <div className="flex flex-col">
                  <div className="w-[280px] h-[220px] rounded overflow-hidden border border-gray-200">
                    <ImageDisplay src={hoveredSub.image} variant="smallsquare" />
                  </div>
                  <Link
                    href={hoveredSub.href || "#"}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Explore {hoveredSub.name || hoveredSub.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Dropdown */}
     {isMenuOpen && (
  <div className="md:hidden bg-white text-black px-2 py-4 absolute top-20 left-0 w-full z-50 shadow-lg">
    <ul className="space-y-4">
      {navLinks.map((link) =>
        link.hasDropdown ? (
          <MobileDropdownMenu
            key={link.name}
            name={link.name}
            href={link.href}
            subLinks={link.subLinks}
            onClickLink={handleMenuItemClick}
          />
        ) : (
          <li key={link.name}>
            <Link
              href={link.href}
              onClick={handleMenuItemClick}
              className="block px-4 py-2 hover:bg-[#F28A15] hover:text-white"
            >
              {link.name}
            </Link>
          </li>
        )
      )}
      <div className="px-4">
      <li>
        <Link
          href="/contact"
          onClick={handleMenuItemClick}
          className="block bg-primary text-white text-lg text-center  px-4 py-3 rounded-full hover:bg-gradient-to-r from-[#D35400] to-[#A84300] transition-all duration-300"
        >
          Contact
        </Link>
      </li>
      </div>

      {/* Social icons inside mobile dropdown */}
      <li className="flex justify-center gap-6 mt-6">
        {contactInfo?.socialLinks?.instagram && (
          <Link
            href={contactInfo.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-pink-500 hover:text-pink-700 text-3xl"
          >
            <FaInstagram />
          </Link>
        )}
        {contactInfo?.socialLinks?.facebook && (
          <Link
            href={contactInfo.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-blue-600 hover:text-blue-800 text-3xl"
          >
            <FaFacebook />
          </Link>
        )}
        {contactInfo?.whatsappNumber && (
          <Link
            href={`https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-green-500 hover:text-green-700 text-3xl"
          >
            <FaWhatsapp />
          </Link>
        )}
      </li>
    </ul>
  </div>
)}
    
    </nav>
  );
}