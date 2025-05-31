'use client';
import TextHeader from "@/components/atoms/headings";
import ImageDisplay from "@/components/atoms/ImageCard";
import TextDescription from "@/components/atoms/description";
const topcategories = [
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description:
      "Explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description:
      "Explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
  {
    src: "/image.png",
    title: "Trekking the Himalayas",
    subtitle: "Walk among the giants",
    description:
      "Explore world-renowned trails like Everest Base Camp, Annapurna Circuit, and Langtang Valley with expert local guides.",
    variant: "square",
    snippet: "Popular",
    snippetPosition: "start",
  },
];

interface Props {
  
  buttonText: string;
}

const TopCategoriesSection = ({ buttonText }: Props) => {
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
       {topcategories.map((card, index) => (
         <div key={index} className="flex flex-col gap-2">
           <div className="aspect-square">
             <ImageDisplay
               src={card.src}
               variant="square"
               snippet={card.snippet}  
               snippetPosition="start"
               title={card.title} 
               description={card.subtitle}  
   
             />
           </div>
           <div className="px-2 flex flex-col">
             <TextHeader text={card?.title} size="small" align="left" />
             <h2 className="text-lg font-semibold">{card.subtitle}</h2>
          <TextDescription text={card.description} className="mt-1"/>
           </div>
         </div>
       ))}
     </div>
   </section>
  );
};

export default TopCategoriesSection;
