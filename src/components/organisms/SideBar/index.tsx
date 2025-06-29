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
  FaChartLine,
  FaBox,
  FaWallet,
  FaUserFriends,
  FaStar,
  FaInbox,
} from "react-icons/fa";
import Logo from "@/components/atoms/Logo";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token"); // Remove correct token from cookies
    router.push("/login"); // Redirect to login page
  };

  return (
    <aside
      className={`bg-slate-900 text-white w-64 p-6 fixed h-screen transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-50 shadow-xl`}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Close Button for mobile */}
        <div className="mb-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo/>
          </div>
          {/* Close button only on mobile */}
          <button
            className="md:hidden text-white text-2xl ml-4"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {[
            { icon: FaTachometerAlt, text: "Dashboard", link: "/dashboard" },
            { icon: FaInbox, text: "Bookings", link: "/dashboard/bookings" },
            { icon: FaUsers, text: "Destiantions", link: "/dashboard/customise-destinations" },
            { icon: FaWallet, text: "Blog Collection", link: "/dashboard/customise-blogs" },
            { icon: FaChartLine, text: "Contact Form", link: "/dashboard/contact" },
            { icon: FaBox, text: "Activities", link: "/dashboard/customise-activities" },
            { icon: FaStar, text: "Testimonials", link: "/dashboard/customise-testimonials" },
            { icon: FaUserFriends, text: " Team", link: "/dashboard/customise-team" },
            { icon: FaCog, text: "Settings", link: "/dashboard/settings" },
          ].map(({ icon: Icon, text, link }, index) => (
            <Link
              key={index}
              href={link}
              className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group border-l-4 border-transparent hover:border-blue-400"
            >
              <div className="flex items-center space-x-3">
                <Icon className="text-lg text-slate-300 group-hover:text-blue-400 transition-colors" />
                <span className="text-slate-300 group-hover:text-white font-medium">{text}</span>
              </div>
              <FaChevronRight className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors" />
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            tabIndex={0}
          >
            <FaSignOutAlt className="text-slate-400" />
            <span className="text-slate-300 font-medium">Logout</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;