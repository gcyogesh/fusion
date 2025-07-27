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

  // Calculate dynamic height and width
  const containerHeight = herodata.height 
    ? (typeof herodata.height === 'number' ? `${herodata.height}px` : herodata.height) 
    : '100vh';
  
  const containerWidth = herodata.width 
    ? (typeof herodata.width === 'number' ? `100%` : herodata.width) 
    : '100%';

  return (
    <div className="relative w-full overflow-hidden" style={{ height: containerHeight, width: containerWidth }}>
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {isGif ? (
          <img
            src={bannerImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={bannerImage}
            alt="Hero Background"
            fill
            style={{ objectFit: 'cover' }}
            fetchPriority="high"
            loading="eager"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-8">
        {/* Centered Title and Search Section */}
        <div className="text-center w-full max-w-4xl py-4 sm:py-6 lg:py-8">
          {/* Title with responsive spacing */}
          <div className="py-6 sm:py-8 lg:py-10">
            <TextHeader
              text={title}
              specialWordsIndices="2"
              align="center"
              width="100%"
              textcolor="white"
              className="w-[80%] md:w-[50%]"
            />
          </div>

          {/* Search Bar with responsive spacing */}
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex justify-center relative">
            <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl">
              <div className="relative flex items-center bg-white rounded-full px-3 sm:px-4 shadow-lg">
                {/* Location Input */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 py-3 sm:py-4">
                  
                  <input
                    id="location"
                    type="text"
                    placeholder="Search Destination, Duration or Interest"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-gray-700 px-4 bg-transparent border-none outline-none placeholder-gray-400 w-full text-sm sm:text-base"
                  />
                </div>

                {/* Search Button */}
                <div className="flex-shrink-0 pl-2">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center justify-center p-2 sm:p-3 rounded-full transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Image 
                        src="/images/mynaui_search.svg" 
                        alt="Search Icon" 
                        width={20} 
                        height={20}
                        className="sm:w-6 sm:h-6"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Search Results Dropdown - Positioned relative to search bar */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 z-50 mt-4">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {searchResults.length > 0
                          ? `Found ${searchResults.length} tour packages`
                          : "No tour packages found"}
                      </h3>
                      <button 
                        onClick={handleCloseResults} 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                              {tour.gallery?.[0] ? (
                                <img 
                                  src={tour.gallery[0]} 
                                  alt={tour.title} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                  <FaMapMarkerAlt className="text-white text-lg sm:text-xl" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                                {tour.title}
                              </h4>
                              <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {tour.location?.city.split(' ').slice(0, 2).join(' ')}, {tour.location?.country}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <FaCalendarAlt className="w-3 h-3" />
                                  <span>{tour.duration?.days}D/{tour.duration?.nights}N</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              {tour.discount ? (
                                <div className="flex flex-col items-end gap-1">
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
                          <p className="text-sm sm:text-base">No tour packages found matching your criteria.</p>
                          <p className="text-xs sm:text-sm mt-2 opacity-75">Try adjusting your search parameters.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description - Left aligned at bottom */}
        <div className="absolute bottom-8 left-0 max-w-2xl px-4 sm:px-6 lg:px-8">
          <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed opacity-90 text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;