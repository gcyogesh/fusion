import { fetchAPI } from "@/utils/apiService";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaHiking,
  FaUsers,
  FaChartLine,
  FaPlus,
} from "react-icons/fa";
import Link from "next/link";

export default async function Dashboard() {
  const destinations = await fetchAPI({ endpoint: "destinations" });
  const blogs = await fetchAPI({ endpoint: "blogs" });
  const activities = await fetchAPI({ endpoint: "activities" });
  const testimonials = await fetchAPI({ endpoint: "testimonials" });

  const stats = [
    {
      title: "Total Destinations",
      value: destinations?.data?.length || 0,
      icon: <FaMapMarkerAlt className="text-2xl text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Total Blogs",
      value: blogs?.data?.length || 0,
      icon: <FaNewspaper className="text-2xl text-green-500" />,
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Total Activities",
      value: activities?.data?.length || 0,
      icon: <FaHiking className="text-2xl text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
    {
      title: "Total Testimonials",
      value: testimonials?.data?.length || 0,
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
    <div className="">
      <div className=" max-w-7xl 
      mx-auto
      space-y-8">
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border ${stat.color}`}
            >
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
                      <p className="text-sm opacity-90">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Destinations */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Destinations
            </h2>
            <div className="space-y-3">
              {destinations?.data?.slice(0, 5).map((destination: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
                >
                  <FaMapMarkerAlt className="text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {destination.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {destination.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/customise-destinations"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block"
            >
              View all destinations →
            </Link>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Blogs
            </h2>
            <div className="space-y-3">
              {blogs?.data?.slice(0, 5).map((blog: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
                >
                  <FaNewspaper className="text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{blog.title}</p>
                    <p className="text-sm text-gray-600">{blog.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/customise-blogs"
              className="text-green-600 hover:text-green-800 text-sm font-medium mt-4 inline-block"
            >
              View all blogs →
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
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                API Status: Online
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 font-medium">
                Database: Connected
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                All Systems: Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
