"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TextHeader from "@/components/atoms/headings";
import Button from "@/components/atoms/button";
import { FaMapMarkerAlt, FaCalendarAlt, FaTimes } from "react-icons/fa";
import ArrowIcon from "@/components/atoms/arrowIcon";

interface HeroData {
  title: string;
  subTitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bannerImage: string;
}

const HeroSection = ({ herodata }: { herodata: HeroData }) => {
  const { title, description, buttonText, bannerImage, buttonLink } = herodata;
  const isGif = bannerImage.toLowerCase().endsWith(".gif");

  const [location, setLocation] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location.trim() && !minDuration && !maxDuration) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();

    if (location.trim()) {
      params.append("location", location.trim());
    }
    if (minDuration) {
      params.append("min", minDuration);
    }
    if (maxDuration) {
      params.append("max", maxDuration);
    }

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

  // 👇 Automatically trigger search after input changes (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.trim() || minDuration || maxDuration) {
        handleSearch();
      }
    }, 700); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [location, minDuration, maxDuration]);

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
    <div className="mx-auto relative w-full h-[860px]">
      {isGif ? (
        <img
          src={bannerImage}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={bannerImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      )}

      <div className="relative w-auto h-full">
        <Image
          src="/images/Blurtext.png"
          alt="Text Background"
          fill
          className="object-cover"
        />

        <TextHeader
          text={title}
          specialWordsIndices="2"
          align="center"
          width="100%"
          textcolor="white"
          className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="absolute top-[72%] md:top-[73%] lg:top-[73%] left-1/2 transform -translate-x-1/2 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-10 text-center md:text-left mb-10">
          <p className="text-white text-base md:text-lg max-w-[486px] mx-auto md:mx-0">
            {description}
          </p>

          <div className="flex justify-center md:justify-end gap-1">
            <Button
              text={buttonText}
              onClick={() => (window.location.href = buttonLink)}
              variant="secondary"
              textColor="text-white"
              className="border border-white w-full h-[55px] mt-4 !px-[15px]"
              rightIcon={<ArrowIcon direction="up-right" variant="primary" size={14} />}
            />
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="absolute w-full max-w-[1100px] mx-auto left-0 right-0 top-[97%] md:top-[96%] lg:top-[95%] z-50 px-2">
        <div className="relative flex items-center bg-white rounded-full px-2 py-2 sm:py-3 shadow-lg gap-0 md:gap-2">
          <div className="flex items-center justify-between overflow-x-auto sm:overflow-visible pr-3 flex-grow">
            {/* Location Input */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
              <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
                <Image src="/images/tdesign_location-filled.svg" alt="Location Icon" width={35} height={35} />
              </span>
              <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
                <label htmlFor="location" className="font-bold">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter your destination"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-gray-500 truncate bg-transparent border-none outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* Min Duration Input */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[100px] sm:min-w-[160px] md:min-w-[200px]">
              <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
                <Image src="/images/uis_calender.svg" alt="Calendar Icon" width={35} height={35} />
              </span>
              <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
                <label htmlFor="minDuration" className="font-bold">Min Days</label>
                <input
                  id="minDuration"
                  type="number"
                  placeholder="Minimum days"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  className="text-gray-500 truncate bg-transparent border-none outline-none placeholder-gray-400 appearance-none"
                  min="1"
                />
              </div>
            </div>

            {/* Max Duration Input */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[110px] sm:min-w-[160px] md:min-w-[200px]">
              <span className="bg-[#FEF2D6] p-1 md:p-4 rounded-full">
                <Image src="/images/uis_calender.svg" alt="Calendar Icon" width={35} height={35} />
              </span>
              <div className="flex flex-col text-[10px] sm:text-sm md:text-base w-full truncate">
                <label htmlFor="maxDuration" className="font-bold">Max Days</label>
                <input
                  id="maxDuration"
                  type="number"
                  placeholder="Maximum days"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="text-gray-500 truncate bg-transparent border-none outline-none placeholder-gray-400 appearance-none"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Search Button (manual trigger retained) */}
          <div className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 sm:relative sm:top-0 sm:translate-y-0 bg-orange-400 md:bg-white rounded-r-3xl rounded-bl-xs flex-shrink-0 z-10">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center md:bg-[#0E334F] px-3 py-3 md:py-2 text-white rounded-full font-medium hover:bg-blue-800 transition whitespace-nowrap text-xs sm:text-sm md:text-base disabled:opacity-50"
            >
              <span className="block sm:hidden">
                <Image src="/images/mynaui_search.svg" alt="Search Icon" width={26} height={25} />
              </span>
              <span className="hidden sm:flex items-center gap-3.5">
                {loading ? "Searching..." : "Find My Adventure"}
                <span className="bg-white p-2.5 rounded-full">
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
              <button
                onClick={handleCloseResults}
                className="text-gray-400 hover:text-gray-600 transition"
              >
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
                        <img
                          src={tour.gallery[0]}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
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
                            {tour.location?.city}, {tour.location?.country}
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
                            {formatPrice(
                              tour.basePrice * (1 - tour.discount.percentage / 100),
                              tour.currency === "334" ? "NPR" : tour.currency
                            )}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(
                              tour.basePrice,
                              tour.currency === "334" ? "NPR" : tour.currency
                            )}
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {tour.discount.percentage}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-800">
                          {formatPrice(
                            tour.basePrice,
                            tour.currency === "334" ? "NPR" : tour.currency
                          )}
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
