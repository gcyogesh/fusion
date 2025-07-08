// app/team/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchAPI } from "@/utils/apiService";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

type TeamMember = {
  _id: string;
  name: string;
  position: string;
  image: string;
  shortinfo?: string;
  contactNumber?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
  };
  certifications?: {
    title: string;
    image: string;
  }[];
};

export default async function Page({ params }: { params: { id: string } }) {
  const endpoint = `teams/${params.id}`; // ✅ Corrected endpoint
  const response = await fetchAPI<{ data: TeamMember }>({ endpoint });

  if (!response || !response.data) return notFound();

  const member = response.data;

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Image */}
        <div className="relative w-[250px] h-[250px] rounded-xl overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover grayscale"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black mb-1">{member.name}</h1>
          <p className="text-lg text-gray-600">{member.position}</p>

          {member.shortinfo && (
            <p className="mt-4 text-sm text-gray-700">{member.shortinfo}</p>
          )}

          {/* Contact & Social */}
          <div className="flex gap-4 mt-6 items-center">
            {member.contactNumber && (
              <a
                href={`tel:${member.contactNumber}`}
                className="text-sm px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Call: {member.contactNumber}
              </a>
            )}
            {member.socialLinks?.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600"
              >
                <FaFacebookF size={18} />
              </a>
            )}
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600"
              >
                <FaLinkedinIn size={18} />
              </a>
            )}
          </div>

          {/* Certifications */}
          {member.certifications?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-md font-semibold mb-2">Certifications</h3>
              <div className="flex gap-4 flex-wrap">
                {member.certifications.map((cert, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm mt-1 text-gray-600">{cert.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
