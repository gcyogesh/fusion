import { Metadata } from "next";
import { DM_Sans } from "next/font/google"; 
import Sidebar from "@/components/organisms/SideBar";
import "../../../app/globals.css"; 
const dmSans = DM_Sans({
  variable: "--font-dm-sans", 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard - Fusion Expeditions",
  description: "Admin Dashboard for managing Fusion Expeditions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" className={dmSans.variable}>
      <body className="flex">
        <Sidebar />
        <main className="flex-1 flex py-16 min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
