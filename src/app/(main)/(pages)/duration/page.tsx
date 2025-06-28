"use client";
import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import Breadcrumb from "@/components/atoms/breadcrumb";

const durationGroups = [
  {
    label: "1–3 Days",
    slug: "1-3-days",
    image: "images/duration/short-trip.png",
    description: "Perfect for a weekend getaway",
    tag: "Short"
  },
  {
    label: "4–7 Days",
    slug: "4-7-days",
    image: "/images/duration/medium-trip.png",
    description: "Explore a little more",
    tag: "Medium"
  },
  {
    label: "7–10 Days",
    slug: "7-10-days",
    image: "/images/duration/long-trip.png",
    description: "Dive deep into the journey",
    tag: "Long"
  },
  {
    label: "10+ Days",
    slug: "10-plus-days",
    image: "/images/duration/extended-trip.png",
    description: "The ultimate travel experience",
    tag: "Extended"
  }
];

export default function DurationPage() {
  return (
    <>
      <Breadcrumb currentnavlink="duration" />
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {durationGroups.map((group) => (
            <Link href={`/duration/${group.slug}`} key={group.slug}>
              <ImageDisplay
                src={group.image}
                variant="square"
                snippet={group.label}
                title={group.label}
                description={group.description}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
