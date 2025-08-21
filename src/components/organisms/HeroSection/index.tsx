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
  const { title, description, bannerImage } = herodata;
  const isGif = bannerImage.toLowerCase().endsWith('.gif');

  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidSize = (value: string | number | undefined) => {
    if (typeof value === 'number') return value >= 100 && value <= 2000;
    if (typeof value === 'string' && /^[\d.]+px$/.test(value)) return true;
    return false;
  };

  // Use fixed dimensions - don't use responsive units like vh, vw, %
  const containerHeight = isValidSize(herodata.height)
    ? typeof herodata.height === 'number'
      ? `${herodata.height}px`
      : herodata.height
    : '600px'; // Default fixed height

  // Always use full screen width regardless of settings
  const containerWidth = '100vw'; // Force full viewport width

  const handleSearch = async () => {
    if (!location.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    params.append('location', location.trim());

    try {
      const res = await fetch(
        `https://newapi.fusionexpeditions.com/api/tour/tour-packages/search?${params.toString()}`
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
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.trim()) handleSearch();
    }, 700);
    return () => clearTimeout(delayDebounce);
  }, [location]);

  const handleCloseResults = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  const formatPrice = (price: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);

  return (
    <div
      className="relative overflow-hidden mx-auto w-full"
      style={{ 
        height: containerHeight, 
        width: containerWidth,
        maxWidth: '100vw' // Ensure full screen coverage
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {isGif ? (
          <img 
            src={bannerImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            style={{
              width: '100vw',
              height: containerHeight,
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <Image
            src={bannerImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/20  z-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        {/* Title and Search */}
        <div className="w-full max-w-4xl text-center py-6 sm:py-8 lg:py-10">
          <TextHeader
            text={title}
            specialWordsIndices="2"
            align="center"
            width={400}
            textcolor="white"
            className="w-full max-w-2xl mx-auto"
          />

          {/* Search */}
          <div className="mt-6 flex justify-center relative">
            <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl">
              <div className="flex items-center bg-white rounded-full px-4 shadow-lg">
                <input
                  type="text"
                  placeholder="Search Destination, Duration or Interest"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-gray-700 px-3 py-3 bg-transparent outline-none text-sm sm:text-base placeholder-gray-400"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="p-2 sm:p-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

              {showResults && (
                <div className="absolute top-full left-0 right-0 z-50 mt-4">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {searchResults.length > 0
                          ? `Found ${searchResults.length} tour packages`
                          : 'No tour packages found'}
                      </h3>
                      <button onClick={handleCloseResults} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((tour) => (
                        <Link
                          key={tour._id}
                          href={`/itinerary/${tour._id}`}
                          className="flex items-center gap-4 p-4 border-b hover:bg-gray-50"
                        >
                          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
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
                            <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                              {tour.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="w-3 h-3" />
                                <span className="truncate">
                                  {tour.location?.city.split(' ').slice(0, 2).join(' ')},{' '}
                                  {tour.location?.country}
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
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-sm font-bold text-green-600">
                                  {formatPrice(
                                    tour.basePrice * (1 - tour.discount.percentage / 100),
                                    tour.currency === '334' ? 'NPR' : tour.currency
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(
                                    tour.basePrice,
                                    tour.currency === '334' ? 'NPR' : tour.currency
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
                                  tour.currency === '334' ? 'NPR' : tour.currency
                                )}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description - left aligned bottom */}
        <div className="absolute bottom-8 left-0 max-w-2xl px-4 sm:px-6 lg:px-8 text-white opacity-90">
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;