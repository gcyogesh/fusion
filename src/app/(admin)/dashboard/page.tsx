import { fetchAPI } from "@/utils/apiService";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaHiking,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaPhoneAlt,
} from "react-icons/fa";
import Link from "next/link";
import { FiArrowRight } from 'react-icons/fi';

export default async function Dashboard() {
  const dashboard = await fetchAPI({ endpoint: "stats/dashboard" });

  const {
    totalBlogs,
    totalDestination,
    totalTestimonial,
    totalBookings,
    totalPartners,
    recent,
  } = dashboard?.message || {};

  const stats = [
    {
      title: "Total Destinations",
      value: totalDestination || 0,
      icon: <FaMapMarkerAlt className="text-2xl text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Total Blogs",
      value: totalBlogs || 0,
      icon: <FaNewspaper className="text-2xl text-green-500" />,
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Total Activities",
      value: recent?.activities?.length || 0,
      icon: <FaHiking className="text-2xl text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
    {
      title: "Total Testimonials",
      value: totalTestimonial || 0,
      icon: <FaUsers className="text-2xl text-purple-500" />,
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
  ];

  const quickActions = [
    {
      title: "Add Destination",
      description: "Create a new destination",
      icon: <FaPlus className="text-xl" />,
      href: "/dashboard/customise-destinations",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add Blog",
      description: "Create a new blog post",
      icon: <FaPlus className="text-xl" />,
      href: "/dashboard/customise-blogs",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Add Activity",
      description: "Create a new activity",
      icon: <FaPlus className="text-xl" />,
      href: "/dashboard/customise-activities",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="flex justify-center w-full px-6 py-10">
      <div className="w-full max-w-[1000px] space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaChartLine className="text-2xl text-gray-400" />
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div
                  className={`p-4 rounded-lg ${action.color} text-white cursor-pointer transition-colors`}
                >
                  <div className="flex items-center space-x-3">
                    {action.icon}
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Content: Destinations & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Destinations */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Destinations
            </h2>
            <div className="space-y-3">
              {recent?.destinations?.filter(Boolean).slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <p className="font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/customise-destinations"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block"
            >
              View all destinations <FiArrowRight className="inline ml-1 align-middle" />
            </Link>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activities
            </h2>
            {recent?.activities?.filter(Boolean).length > 0 ? (
              <div className="space-y-3">
                {recent.activities.filter(Boolean).slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <FaHiking className="text-orange-500" />
                    <p className="font-medium text-gray-900">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-orange-50 rounded-xl border border-orange-100">
                <FaHiking className="text-5xl text-orange-300 mb-3" />
                <p className="text-lg font-semibold text-orange-700 mb-1">No recent activities found</p>
                <p className="text-sm text-orange-500 mb-4">Start by adding a new activity to engage your users!</p>
                <Link href="/dashboard/customise-activities">
                  <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition">Add Activity</button>
                </Link>
              </div>
            )}
            <Link
              href="/dashboard/customise-activities"
              className="text-orange-600 hover:text-orange-800 text-sm font-medium mt-4 inline-block"
            >
              View all activities <FiArrowRight className="inline ml-1 align-middle" />
            </Link>
          </div>
        </div>

        {/* Recent Bookings & Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Bookings
            </h2>
            {recent?.bookings?.filter(Boolean).length > 0 ? (
              <div className="space-y-3">
                {recent.bookings.filter(Boolean).slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <FaUsers className="text-indigo-500" />
                    <p className="font-medium text-gray-900">
                      {typeof item === "string" ? item : "Unnamed Booking"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No recent bookings found.</p>
            )}
            <Link
              href="/dashboard/customise-bookings"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-4 inline-block"
            >
              View all bookings →
            </Link>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Contacts
            </h2>
            {recent?.contacts?.filter(Boolean).length > 0 ? (
              <div className="space-y-3">
                {recent.contacts.filter(Boolean).slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <FaPhoneAlt className="text-teal-500" />
                    <p className="font-medium text-gray-900">
                      {typeof item === "string" ? item : "Contact Info"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No recent contacts found.</p>
            )}
            <Link
              href="/dashboard/customise-contacts"
              className="text-teal-600 hover:text-teal-800 text-sm font-medium mt-4 inline-block"
            >
              View all contacts →
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-green-700 font-medium">API Status: Online</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-blue-700 font-medium">Database: Connected</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-green-700 font-medium">All Systems: Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}