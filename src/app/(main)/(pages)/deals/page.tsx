import Link from "next/link";
import Image from "next/image";
import ImageDisplay from "@/components/atoms/ImageCard";
import { fetchAPI } from "@/utils/apiService";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";
import Breadcrumb from "@/components/atoms/breadcrumb";

type Tour = {
  _id: string;
  title: string;
  description: string;
  overview:string;
  gallery?: string[];
  image: string;
  location?: {
    city: string;
    country: string;
  };
  duration?: {
    days: number;
    nights: number;
  };
};

export default async function Deals() {
  let deals: Tour[] = [];

  try {
    const response = await fetchAPI<{
      data: Tour[];
      success: boolean;
    }>({
      endpoint: "tour/tour-packages/tag/special",
      method: "GET",
      revalidateSeconds: 60,
    });

    if (response?.data && Array.isArray(response.data)) {
      deals = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch special deals:", error);
  }

  if (!deals.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No special deals found.
      </p>
    );
  }

  return (
    <>
    <Breadcrumb currentnavlink={"Deals"} />
    <section className="max-w-7xl mx-auto px-4 py-10">
       <TextHeader
          text="Best Deals"
          specialWordsIndices="1"
          size="medium"
          width={622}
          align="left"
          className="mb-4" 
        />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {deals.map((card) => (
          <Link
            href={`/itinerary/${card._id}`}
            key={card._id}
            className="flex flex-col gap-4"
          >
            <div className="aspect-video">
              <ImageDisplay
                src={card.gallery?.[0]}
                variant="square"
                snippet="special"
                snippetPosition="start"
                title={card.title}
                description={card.description || ""}
              />
            </div>
        

    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm ">
        <span className="flex items-center gap-1 font-medium text-[20px] text-[#7E7E7E]">
          <Image src={"/images/Location.svg"} alt="Clock" width={20} height={20}/>
          {card.location.city.split(' ')[0]}, {card.location.country}
        </span>
        <span className="flex items-center gap-2 font-medium text-[20px]  text-[#7E7E7E]  ">
          <Image src={"/images/clock.svg"} alt="Clock" width={20} height={20}/>
          {card.duration.days} Days
        </span>
      </div>

      <TextHeader text={card.overview} size="small" align="left" width={410}  className="line-clamp-2"/>
      <TextDescription text={card.description} className="line-clamp-3" />
      <div className="w-full h-[1.5px] bg-[#C2C2C2]" />
      

      <div className="flex flex-row  text-lg font-medium text-[#7E7E7E] text-[20px] mt-1">
        Starting Price:  <span className="text-primary font-semibold ml-5"> ${card.basePrice}</span>
      </div>
    </div>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}
