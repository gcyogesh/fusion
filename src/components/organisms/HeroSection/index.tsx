"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TextHeader from "@/components/atoms/headings";
import Button from "@/components/atoms/button";
import { FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaSearch } from "react-icons/fa";
import ArrowIcon from "@/components/atoms/arrowIcon";

interface HeroData {
  title: string;
  subTitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bannerImage: string;
  height?: string | number;
  width?: string | number;
}

const HeroSection = ({ herodata }: { herodata: HeroData }) => {
  const { title, description, buttonText, bannerImage, buttonLink } = herodata;
  const isGif = bannerImage.toLowerCase().endsWith(".gif");

  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    params.append("location", location.trim());

    try {
      const res = await fetch(
        `https://yogeshbhai.ddns.net/api/tour/tour-packages/search?${params.toString()}`
      );
      const data = await res.json();

      if (res.ok && data.data && data.data.length > 0) {
        setSearchResults(data.data);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.trim()) {
        handleSearch();
      }
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [location]);

  const handleCloseResults = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  return (
<<<<<<< HEAD
    <div className="mx-auto relative w-full h-[860px] ">
=======
    <div className="mx-auto relative w-full" style={{ height: herodata.height ? (typeof herodata.height === 'number' ? `${herodata.height}px` : herodata.height) : '860px', width: herodata.width ? (typeof herodata.width === 'number' ? `${herodata.width}px` : herodata.width) : '100%' }}>
>>>>>>> 930012615655208fb26095fdf62ab06a02983474
      {isGif ? (
        <img
          src={bannerImage}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover "
        />
      ) : (
        <Image
          src={bannerImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          fetchPriority="high"
          loading="eager"
        />
      )}


      <div className="relative w-auto h-full bg-black/20">
     
        <TextHeader
          text={title}
          specialWordsIndices="2"
          align="center"
          width="100%"
          textcolor="white"
          className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="absolute top-[72%] md:top-[73%] lg:top-[73%] left-1/2 transform -translate-x-1/2 w-full max-w-7xl mx-auto  px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-10 text-center md:text-left mb-10">
          <p className="text-white text-base md:text-lg max-w-[500px] mx-auto md:mx-0 text-justify-balanced">
            {description}
          </p>

          {/* <div className="flex justify-center md:justify-end gap-1">
            <Button
              text={buttonText}
              onClick={() => (window.location.href = buttonLink)}
              variant="secondary"
              textColor="text-white"
              className="border border-white w-full h-[55px] mt-4 !px-[15px]"
              rightIcon={<ArrowIcon direction="up-right" variant="primary" size={14} />}
            />
          </div> */}
        </div>
      </div>

      {/* SEARCH BAR (Only Location) */}
      <div className="absolute w-full  max-w-[340px] md:max-w-[780px] mx-auto left-0 right-0 top-[97%] md:top-[98%] lg:top-[96%] z-50 px-2">
        <div className="relative flex items-center bg-white rounded-full px-3 shadow-lg gap-2">
          {/* Location Input Only */}
          <div className="flex items-center gap-2 w-full">
            <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
              <Image src="/images/tdesign_location-filled.svg" alt="Location Icon" width={20} height={20} />
            </span>
            <div className="flex flex-col w-full">
              <input
                id="location"
                type="text"
                placeholder="Where's your next adventure?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-gray-500 truncate bg-transparent border-none outline-none placeholder-gray-400 w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-r-3xl flex-shrink-0 z-10">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center px-1  md:px-3 py-2 md:py-2 text-white rounded-full font-medium  transition whitespace-nowrap text-xs sm:text-sm md:text-base disabled:opacity-50"
            >
              <span >
                <FaSearch className="text-white w-[10px] h-[10px] " />
              </span>
              <span className=" sm:flex items-center gap-3.5">
                {loading ? "Searching..." : ""}
                <span className=" p-0 md:p-3 rounded-full">
                  {loading ? (
                    <div className="w-7 h-7 border-2 border-[#0E334F] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Image src="/images/mynaui_search.svg" alt="Search Icon" width={28} height={28} />
                  )}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="mt-4 bg-white rounded-2xl shadow-xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} tour packages`
                  : "No tour packages found"}
              </h3>
              <button onClick={handleCloseResults} className="text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((tour) => (
                  <Link
                    key={tour._id}
                    href={`/itinerary/${tour._id}`}
                    className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      {tour.gallery?.[0] ? (
                        <img src={tour.gallery[0]} alt={tour.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <FaMapMarkerAlt className="text-white text-xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate text-sm md:text-base">
                        {tour.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span className="truncate">
                            {tour.location?.city.split(' ').slice(0, 2).join(' ')}, {tour.location?.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{tour.duration?.days}D/{tour.duration?.nights}N</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {tour.discount ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-green-600">
                            {formatPrice(tour.basePrice * (1 - tour.discount.percentage / 100), tour.currency === "334" ? "NPR" : tour.currency)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(tour.basePrice, tour.currency === "334" ? "NPR" : tour.currency)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {tour.discount.percentage}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-800">
                          {formatPrice(tour.basePrice, tour.currency === "334" ? "NPR" : tour.currency)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tour packages found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search parameters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
