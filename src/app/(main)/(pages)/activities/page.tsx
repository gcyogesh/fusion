import Link from "next/link";
import ImageDisplay from "@/components/atoms/ImageCard";
import Breadcrumb from "@/components/atoms/breadcrumb";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import HeroBanner from "@/components/organisms/Banner/HeroBanner";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export default async function CategoriesPage() {
  const response = await fetchAPI<{ data: Category[] }>({ endpoint: "category/activities" });
  const categories = response?.data || [];
  
  const herodata = await fetchAPI({ endpoint: "herobanner/activities" });

  return (
    <>
      <Breadcrumb currentnavlink="Activities" />
      <HeroBanner herodata={herodata?.data || []} />
      <section className="max-w-7xl mx-auto px-6 py-12">
        <TextHeader
          text="Explore by Categories"
          buttonText="Activities"
          specialWordsIndices="2"
          size="medium"
          width={622}
          align="left"
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              href={`/activities/${category.slug}`}
              key={category.slug}
            >
              <ImageDisplay
                src={category.image}
                variant="square"
                title={category.name}
                showDefaultTitle={true}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
