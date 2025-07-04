'use client';
import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextDescription from "@/components/atoms/description";
import Link from "next/link";

interface Activity {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
}

interface Props {
  buttonText: string;
  activities: Activity[];
}

const TopCategoriesSection = ({ buttonText, activities }: Props) => {
  return (
   <section className="max-w-7xl mx-auto px-6">
     <TextHeader
       text="Unforgettable Experiences Await"
       align="left"
       width="500px"
       specialWordsIndices="1"
       buttonText={buttonText}
       className="mb-6"
     />
   
     <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
       {activities.slice(0, 3).map((card) => (
         <Link key={card._id} href={`/activities/${card.slug}`} className="flex flex-col gap-2">
           <div className="aspect-square">
             <ImageDisplay
               src={card.image}
               variant="square"
               snippet="Popular"
               snippetPosition="start"
               title={card.title}
               description={card.subtitle}
             />
           </div>
           <div className="px-2 flex flex-col">
             <TextHeader text={card.title} size="small" align="left" />
             <h2 className="text-lg font-semibold">{card.subtitle}</h2>
             <TextDescription text={card.description} className="mt-1 line-clamp-2"/>
           </div>
         </Link>
       ))}
     </div>
   </section>
  );
};

export default TopCategoriesSection;
