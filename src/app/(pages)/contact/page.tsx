import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import ContactDetails from "@/components/organisms/ContactDetails";

export default async function contact() {

return(


<div className="mx-auto max-w-7xl py-20 ">

<h3>Contact Details</h3>
<ContactDetails  />

    <div className="w-full h-[500px]">
      <iframe
        src="https://www.google.com/maps"
        title="Google Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
</div>

)


    
}