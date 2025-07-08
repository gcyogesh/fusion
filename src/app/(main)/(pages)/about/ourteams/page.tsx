import Image from "next/image";
import Link from "next/link";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";
import Breadcrumb from "@/components/atoms/breadcrumb";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default async function TeamPage() {
  const teamsdata = await fetchAPI({ endpoint: "teams" });
  const profile = teamsdata.data;

  return (
    <>
      <Breadcrumb currentnavlink="Team" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col py-10 text-center">
          <TextHeader
            text="Fusion Expeditions – Crafted in the Heart of Nepal"
            align="center"
            size="large"
            width="420px"
            textcolor="Black"
            buttonText="Meet Our Team"
          />
          <TextDescription
            text="Meet our expert guides and local partners who make every journey unforgettable."
            className="text-[#535556] w-full max-w-[420px] mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg :grid-cols-4 gap-10 pb-20">
          {profile.map((item: any) => (
            <div key={item._id} className="flex flex-col items-center text-center">
              <div className="relative w-[200px] h-[200px] mb-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <TextHeader text={item.name} align="center" size="small" textcolor="text-primary" className="mb-1" />
              <p className="text-medium font-semibold text-gray-600">{item.position}</p>
              <TextDescription className="" text={item.shortinfo} />

              <div className="flex justify-center items-center gap-4 mt-3 text-gray-600">
                {item.socialLinks?.facebook && (
                  <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    <FaFacebookF size={18} className="text-[#0e334f]"/>
                  </a>
                )}
                {item.socialLinks?.linkedin && (
                  <a href={item.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    <FaLinkedinIn size={18} className="text-[#0e334f]"/>
                  </a>
                )}
                {item.socialLinks?.instagram && (
                  <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">
                    <FaInstagram size={18} className="text-[#0e334f]"/>
                  </a>
                )}
                {item.socialLinks?.twitter && (
                  <a href={item.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
                    <FaXTwitter size={18}  className="text-[#0e334f]"/>
                  </a>
                )}
              </div>

           <Link href={`/about/ourteams/${item._id}`}>
  <button className="mt-4 text-sm text-primary hover:bg-primary/10">
    View More
  </button>
</Link>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}
