import TextDescription from "@/components/atoms/description";
import ImageDisplay from "@/components/atoms/ImageCard";

const ItineraryCard = ({ title, description, image }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {image && (
        <ImageDisplay
          src={image}
          alt={title}
          className="w-full h-56 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <TextDescription text={description} className="text-gray-700" />
    </div>
  );
};

export default ItineraryCard;