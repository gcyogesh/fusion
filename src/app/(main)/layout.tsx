import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { fetchAPI } from "@/utils/apiService";
import '../../app/globals.css';

import Footer from "@/components/organisms/Footer";
import Navbar from "@/components/organisms/NavBar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans", // This links to your CSS variable
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fusion Expeditions",
  description: "We are hear to fulfill your desire to experience different kinds of adventure activities.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch destinations and activities
  const destinationsRes: any = await fetchAPI({ endpoint: "destinations" });
  const activitiesRes: any = await fetchAPI({ endpoint: "activities" });

  const destinations = destinationsRes?.data || [];
  const activities = activitiesRes?.data || [];

  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased bg-[#fef9ee]">
        <Navbar destinations={destinations} activities={activities} />
        {children}
        <Footer destinations={destinations.slice(0, 5)} />
      </body>
    </html>
  );
}
