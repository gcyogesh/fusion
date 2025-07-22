import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { fetchAPI } from "@/utils/apiService";
import "../../app/globals.css";

import Footer from "@/components/organisms/Footer";
import Navbar from "@/components/organisms/NavBar";
import { TourPackage, Duration } from "@/types";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fusion Expeditions",
  description: "We are here to fulfill your desire to experience different kinds of adventure activities.",
};

const durationGroups: Duration[] = [
  {
    label: "1–3 Days",
    slug: "1-3-days",
    image: "/images/duration/short-trip.png",
    description: "Perfect for a weekend getaway",
    tag: "Short",
  },
  {
    label: "4–7 Days",
    slug: "4-7-days",
    image: "/images/duration/medium-trip.png",
    description: "Explore a little more",
    tag: "Medium",
  },
  {
    label: "7–10 Days",
    slug: "7-10-days",
    image: "/images/duration/long-trip.png",
    description: "Dive deep into the journey",
    tag: "Long",
  },
  {
    label: "10+ Days",
    slug: "10-plus-days",
    image: "/images/duration/extended-trip.png",
    description: "The ultimate travel experience",
    tag: "Extended",
  },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch destinations and activities
  const destinationsRes = await fetchAPI({ endpoint: "destinations" });
  const activitiesRes = await fetchAPI({ endpoint: "category/activities" });
  const contactInfoRes = await fetchAPI({ endpoint: "info" });

  const destinations = destinationsRes?.data || [];
  const activities = activitiesRes?.data || [];
  const contactInfo = contactInfoRes?.data ;

  const relatedPackagesMap: { [slug: string]: any[] } = {};
  const relatedActivityPackagesMap: { [slug: string]: any[] } = {};
  const relatedDurationPackagesMap: { [slug: string]: any[] } = {};

  // Related packages per destination
  await Promise.all(
    destinations.map(async (dest: any) => {
      try {
        const res = await fetchAPI({
          endpoint: `destinations/${dest.slug}`,
        }) as {
          data: {
            destination: any;
            relatedPackages: { _id: string }[];
          };
        };

        const relatedPackages = await Promise.all(
          (res?.data?.relatedPackages || []).map(async (pkg) => {
            try {
              const pkgRes = await fetchAPI({
                endpoint: `tour/tour-packages/${pkg._id}`,
              }) as { data: any };

              return pkgRes.data;
            } catch {
              return null;
            }
          })
        );

        relatedPackagesMap[dest.slug] = relatedPackages.filter(Boolean);
      } catch {
        relatedPackagesMap[dest.slug] = [];
      }
    })
  );

  // Related packages per activity
  await Promise.allSettled(
    activities.map(async (activity) => {
      try {
        const res = await fetchAPI({
          endpoint: `tour/tour-packages/category/slug/${activity.slug}`,
        }) as { data: TourPackage[] | TourPackage };

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

  // Related packages per duration
  await Promise.allSettled(
    durationGroups.map(async (duration) => {
      try {
        const res = await fetchAPI({
          endpoint: `tour/tour-packages/duration/${duration.slug}`,
        }) as { data: TourPackage[] | TourPackage };

        let packages: TourPackage[] = [];
        if (res?.data) {
          packages = Array.isArray(res.data) ? res.data : [res.data];
        }
        relatedDurationPackagesMap[duration.slug] = packages;
      } catch {
        try {
          const getDurationRange = (slug: string) => {
            switch (slug) {
              case "1-3-days": return { min: 1, max: 3 };
              case "4-7-days": return { min: 4, max: 7 };
              case "7-10-days": return { min: 7, max: 10 };
              case "10-plus-days": return { min: 10, max: 999 };
              default: return { min: 1, max: 999 };
            }
          };

          const range = getDurationRange(duration.slug);
          let allPackagesRes;

          try {
            allPackagesRes = await fetchAPI({
              endpoint: `tour/tour-packages/filter-by-duration?min=${range.min}&max=${range.max}`,
            }) as { data: TourPackage[] };
          } catch {
            allPackagesRes = await fetchAPI({
              endpoint: "tour/tour-packages",
            }) as { data: TourPackage[] };
          }

          const allPackages = allPackagesRes?.data || [];
          const filteredPackages = allPackages.filter((pkg) => {
            const days = pkg.duration?.days || 0;
            return days >= range.min && (range.max === 999 ? true : days <= range.max);
          });

          relatedDurationPackagesMap[duration.slug] = filteredPackages;
        } catch {
          relatedDurationPackagesMap[duration.slug] = [];
        }
      }
    })
  );

  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased bg-[#F5F5F5]">
        <Navbar
          destinations={destinations}
          activities={activities}
          relatedPackagesMap={relatedPackagesMap}
          relatedActivityPackagesMap={relatedActivityPackagesMap}
          relatedDurationPackagesMap={relatedDurationPackagesMap}
          contactInfo={contactInfo}
          durationGroups={durationGroups}
        />
        {children}
        <Footer
          destinations={destinations.slice(0, 5)}
          contactInfo={contactInfo}
        />
      </body>
    </html>
  );
}
