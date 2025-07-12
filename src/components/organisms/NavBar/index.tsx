"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

import Image from "next/image";

import Logo from "@/components/atoms/Logo";
import MobileDropdownMenu from "./dropdowns/mobiledropdown";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextHeader from "@/components/atoms/headings";

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
      name: string;
      href: string;
      duration?: string;
      title?: string;
    }[];
  }[];
};


type Destination = {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrls?: string[];
  image?: string;
};

type Activity = {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrls?: string[];
  image?: string;
};

interface TourPackage {
  _id: string;
  title: string;
  description: string;
  overview: string;
  location: {
    city: string;
    country: string;
  };
  basePrice: number;
  currency: string;
  gallery: string;
  duration: {
    days: number;
    nights: number;
  };
  imageUrls?: string[];
}

interface NavbarProps {
  destinations: Destination[];
  activities: Activity[];
  relatedPackagesMap: { [slug: string]: TourPackage[] };
}

export default function Navbar({
  destinations = [],
  activities = [],
  relatedPackagesMap = {},
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<NavLink | null>(null);
  const [hoveredSub, setHoveredSub] = useState<NavLink["subLinks"][0] | null>(null);

  // Added missing scroll states
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();

  useEffect(() => {
    // Format activities
    const formattedActivities = activities.map((item) => ({
      name: item.title,
      href: `/activities/${item.slug}`,
      subtitle: item.subtitle || "",
      image: item.imageUrls?.[0] || item.image || "",
      title: item.title,
    }));

    // Format destinations, inject relatedPackages from relatedPackagesMap
    const formattedDestinations = destinations.map((item) => {
      const relatedPkgs = relatedPackagesMap[item.slug] || [];
      return {
        name: item.title,
        href: `/destinations/${item.slug}`,
        image: item.imageUrls?.[0] || item.image || "",
        relatedPackages: relatedPkgs.map((pkg) => ({
          name: pkg.title,
          href: `/itinerary/${pkg._id}`,
          duration: pkg.duration ? `${pkg.duration.days} Days` : undefined,
        })),
      };
    });

    // Build nav links
    const links: NavLink[] = [
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
        name: "About",
        href: "/about",
        hasDropdown: true,
        subLinks: [
          {
            name: "Our Teams",
            href: "/about/ourteams",
            subtitle: "Meet the passionate people behind our mission",
            title: "Ourteams",
          },
          {
            name: "Fusion",
            href: "/about",
            subtitle: "Explore our story, values, and what drives us forward",
            title: "Fusion",
          },
        ],
      },
      { name: "Blogs", href: "/blogs", hasDropdown: false },
      { name: "Duration", href: "/duration", hasDropdown: false },
      { name: "Deals", href: "/deals", hasDropdown: false },
    ];

    setNavLinks(links);
  }, [destinations, activities, relatedPackagesMap]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY === 0) setShowNavbar(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 100) setShowNavbar(false);
      else setShowNavbar(true);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getNavbarClasses = () => {
    if (pathname === "/" && scrollY === 0) return "blur-base bg-white/20 text-white shadow-lg";
    return "bg-[#0e334f] text-white";
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setHoveredSub(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-60 px-2 transition-all duration-300 ease-linear ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${getNavbarClasses()}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4 h-20">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <ul className="relative hidden md:flex gap-8 font-medium text-base">
          {navLinks.map((link) => (
            <li
              key={link.name}
              onMouseEnter={() => {
                if (link.hasDropdown) {
                  setActiveDropdown(link);
                  setHoveredSub(link.subLinks?.[0] || null);
                }
              }}
              className="relative group flex items-center gap-1"
            >
              <Link href={link.href}>{link.name}</Link>
              {link.hasDropdown &&
                (activeDropdown?.name === link.name ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link href="https://wa.me/977985-1167629" target="_blank" className="cursor-pointer">
            <FaWhatsapp className="text-white text-3xl hover:text-green-400 transition-colors" />
          </Link>
          <Link href="/contact" className="hidden lg:block">
            <button className="bg-primary hover:bg-gradient-to-r from-[#D35400] to-[#A84300] text-white text-base font-medium h-[46px] w-[160px] rounded-full">
              Contact
            </button>
          </Link>
          <button className="text-3xl md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <IoMdClose /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Desktop Dropdown */}
      {activeDropdown && (
        <div
          className="absolute top-[80px] left-0 w-full text-black z-50 hidden md:block"
          onMouseLeave={closeDropdown}
        >
          <div className="max-w-6xl mx-auto flex bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 px-8">
            {/* Left column - Sublinks list */}
            <div className="w-[300px] px-4 py-6">
              <ul className="divide-y divide-gray-200">
                {activeDropdown.subLinks?.map((sub) => (
                  <li key={sub.name} onMouseEnter={() => setHoveredSub(sub)}>
                    <Link
                      href={sub.href}
                      className={`flex justify-between items-center px-5 py-3 hover:bg-primary hover:text-white transition-colors ${
                        hoveredSub?.name === sub.name ? "bg-primary text-white" : ""
                      }`}
                    >
                      <span>{sub.name}</span>
                      <ChevronRight
                        size={16}
                        className={`transition-colors ${
                          hoveredSub?.name === sub.name ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-[1px] h-auto my-6 bg-gray-300 m-8" />

            {/* Right column - Preview content */}
            <div className="flex-1 px-4 py-6 flex gap-6 items-start">
              <div className="flex-1">
                <TextHeader text={hoveredSub?.title || "Explore"} align="left" size="small" />
                
                <Link
                  href={hoveredSub?.href || "#"}
                  className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Explore {hoveredSub?.name}
                </Link>
              </div>

              {hoveredSub?.relatedPackages?.length > 0 && (
                <div className="ml-4 mt-2">
                  <p className="text-sm font-semibold">Related Packages:</p>
                  <ul className="pl-3 text-sm text-gray-700 list-disc">
                    {hoveredSub.relatedPackages.map((pkg, idx) => (
                      <li key={idx}>
                        <Link href={pkg.href}>
                          {pkg.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hoveredSub?.image && (
                <div className="w-[280px] h-[220px] rounded overflow-hidden border border-gray-200">
                  <ImageDisplay src={hoveredSub.image} variant="smallsquare" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-black px-4 py-6 absolute top-20 left-0 w-full z-50 shadow-lg">
          <ul className="space-y-4">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <MobileDropdownMenu
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  subLinks={link.subLinks}
                  onClickLink={() => setIsMenuOpen(false)}
                />
              ) : (
                <li key={link.name}>
                  <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="block py-2">
                    {link.name}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-primary text-white text-center py-2 rounded-full"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
