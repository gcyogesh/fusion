import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { fetchAPI } from "@/utils/apiService";
import "../../app/globals.css";

import Footer from "@/components/organisms/Footer";
import Navbar from "@/components/organisms/NavBar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fusion Expeditions",
  description: "We are here to fulfill your desire to experience different kinds of adventure activities.",
};

interface TourPackage {
  _id: string;
  title: string;
  description: string;
  category?: {
    slug: string;
    title: string;
  };
}

interface Destination {
  title: string;
  slug: string;
  imageUrls?: string[];
}

interface Activity {
  title: string;
  slug: string;
  imageUrls?: string[];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    const [destinationsRes, activitiesRes] = await Promise.allSettled([
      fetchAPI({ endpoint: "destinations" }),
      fetchAPI({ endpoint: "category/activities" }),
    ]);

    const destinations: Destination[] = destinationsRes.status === 'fulfilled' ? (destinationsRes.value?.data || []) : [];
    const activities: Activity[] = activitiesRes.status === 'fulfilled' ? (activitiesRes.value?.data || []) : [];

    const relatedDestinationPackagesMap: { [slug: string]: TourPackage[] } = {};
    const relatedActivityPackagesMap: { [slug: string]: TourPackage[] } = {};

    // Fetch related packages for destinations
    await Promise.allSettled(
      destinations.map(async (dest) => {
        try {
          const res = await fetchAPI({ endpoint: `destinations/${dest.slug}` }) as {
            data: { relatedPackages: { _id: string }[] };
          };

          if (res?.data?.relatedPackages?.length) {
            const relatedPackages = await Promise.allSettled(
              res.data.relatedPackages.map(pkg =>
                fetchAPI({ endpoint: `tour/tour-packages/${pkg._id}` }).then(r => (r as { data: TourPackage }).data)
              )
            );

            relatedDestinationPackagesMap[dest.slug] = relatedPackages
              .filter(r => r.status === 'fulfilled')
              .map(r => (r as PromiseFulfilledResult<TourPackage>).value)
              .filter(Boolean);
          } else {
            relatedDestinationPackagesMap[dest.slug] = [];
          }
        } catch {
          relatedDestinationPackagesMap[dest.slug] = [];
        }
      })
    );

    // Fetch related packages for activities
    await Promise.allSettled(
      activities.map(async (activity) => {
        try {
          const res = await fetchAPI({ endpoint: `tour/tour-packages/category/slug/${activity.slug}` }) as { data: TourPackage[] | TourPackage };

          let packages: TourPackage[] = [];
          if (res?.data) {
            packages = Array.isArray(res.data) ? res.data : [res.data];
          }
          relatedActivityPackagesMap[activity.slug] = packages;
        } catch {
          relatedActivityPackagesMap[activity.slug] = [];
        }
      })
    );

    return (
      <html lang="en" className={dmSans.variable}>
        <body className="antialiased bg-[#fef9ee]">
          <Navbar
            destinations={destinations}
            activities={activities}
            relatedPackagesMap={relatedDestinationPackagesMap}
            relatedActivityPackagesMap={relatedActivityPackagesMap}
          />
          {children}
          <Footer destinations={destinations.slice(0, 5)} />
        </body>
      </html>
    );
  } catch (error) {
    console.error("Error in RootLayout:", error);

    return (
      <html lang="en" className={dmSans.variable}>
        <body className="antialiased bg-[#fef9ee]">
          <Navbar destinations={[]} activities={[]} relatedPackagesMap={{}} relatedActivityPackagesMap={{}} />
          {children}
          <Footer destinations={[]} />
        </body>
      </html>
    );
  }
}
