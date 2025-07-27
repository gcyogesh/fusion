"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaChartLine,
  FaBox,
  FaWallet,
  FaUserFriends,
  FaStar,
  FaInbox,
  FaUser,
} from "react-icons/fa";
import Logo from "@/components/atoms/Logo";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  const menuItems = [
    { icon: FaTachometerAlt, text: "Dashboard", link: "/dashboard" },
    { icon: FaInbox, text: "Bookings", link: "/dashboard/bookings" },
    { icon: FaUsers, text: "Destinations", link: "/dashboard/customise-destinations" },
    { icon: FaWallet, text: "Blog Collection", link: "/dashboard/customise-blogs" },
    {
      icon: FaChartLine,
      text: "Enquiry Form",
      link: "/dashboard/contact-form",
      submenu: [
        {
          icon: FaChartLine,
          text: "Enquiry Messages",
          link: "/dashboard/contact-form/contact",
        },
        {
          icon: FaUser,
          text: "Private Trip",
          link: "/dashboard/contact-form/private-trips",
        },
      ],
    },
    { icon: FaBox, text: "Activities", link: "/dashboard/customise-activities" },
    {
      icon: FaChartLine,
      text: "Users Feedback",
      link: "/dashboard/user-feedback",
      submenu: [
        {
          icon: FaChartLine,
          text: "Testimonials",
          link: "/dashboard/user-feedback/customise-testimonials",
        },
        {
          icon: FaStar,
          text: "Reviews",
          link: "/dashboard/user-feedback/reviews",
        },
      ],
    },
    { icon: FaUserFriends, text: "Team", link: "/dashboard/customise-team" },
    { icon: FaCog, text: "Settings", link: "/dashboard/settings" },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white w-64 fixed h-screen transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-50 shadow-2xl border-r border-slate-700/50`}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              className="md:hidden text-slate-300 hover:text-white text-2xl transition-colors duration-200 p-1 rounded-md hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Navigation Section - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hidden">
          <nav className="space-y-1">
            {menuItems.map(({ icon: Icon, text, link, submenu }, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => {
                    if (submenu) {
                      setOpenMenu(openMenu === text ? null : text);
                    } else {
                      router.push(link);
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800/60 transition-all duration-200 group text-left cursor-pointer relative overflow-hidden"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                  
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-blue-500/20 transition-all duration-200">
                      <Icon className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-slate-300 group-hover:text-white font-medium text-sm">
                      {text}
                    </span>
                  </div>
                  
                  {submenu && (
                    <div className="relative z-10">
                      {openMenu === text ? (
                        <FaChevronDown className="text-xs text-slate-500 group-hover:text-blue-400 transition-all duration-200" />
                      ) : (
                        <FaChevronRight className="text-xs text-slate-500 group-hover:text-blue-400 transition-all duration-200" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu Items */}
                {submenu && openMenu === text && (
                  <div className="mt-2 space-y-1 bg-slate-800/30 rounded-xl p-2 ml-2 border-l-2 border-blue-500/30">
                    {submenu.map(({ icon: SubIcon, text: subText, link: subLink }, subIdx) => (
                      <Link
                        key={subIdx}
                        href={subLink}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer relative overflow-hidden"
                      >
                        {/* Submenu hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                        
                        <div className="p-1.5 rounded-md bg-slate-700/50 group-hover:bg-blue-500/20 transition-all duration-200 relative z-10">
                          <SubIcon className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span className="text-slate-400 group-hover:text-white font-medium text-sm relative z-10">
                          {subText}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Fixed Logout Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 w-full text-left cursor-pointer group relative overflow-hidden border border-transparent hover:border-red-500/20"
          >
            {/* Logout hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            
            <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-red-500/20 transition-all duration-200 relative z-10">
              <FaSignOutAlt className="text-sm text-red-400 group-hover:text-red-300 transition-colors" />
            </div>
            <span className="text-slate-300 group-hover:text-red-300 font-medium text-sm relative z-10">
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;