"use client";

import { useState } from "react";
import Image from "next/image";
import { fetchAPI } from "@/utils/apiService";
import TextHeader from "@/components/atoms/headings";
import TextDescription from "@/components/atoms/description";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

// Modal component
function TeamModal({ member, onClose }: { member: any; onClose: () => void }) {
  if (!member) return null;
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity duration-300">
    <div className="bg-white shadow-2xl p-6 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Profile Image */}
        <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden shadow-md">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover grayscale"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h1>
          <p className="text-lg text-gray-600">{member.position}</p>

          {member.shortinfo && (
            <p className="mt-4 text-sm text-gray-700 leading-relaxed">{member.shortinfo}</p>
          )}

          {member.contactNumber && (
            <p className="mt-4 text-sm text-blue-600 font-medium">
              📞 Contact: {member.contactNumber}
            </p>
          )}

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            {member.socialLinks?.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 text-gray-700"
              >
                <FaFacebookF size={20} />
              </a>
            )}
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 text-gray-700"
              >
                <FaLinkedinIn size={20} />
              </a>
            )}
          </div>

          {/* Certifications */}
          {member.certifications?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Certifications</h3>
              <div className="flex flex-wrap gap-4">
                {member.certifications.map((cert: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="relative w-[80px] h-[80px] mx-auto shadow rounded-lg overflow-hidden">
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-600">{cert.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

// Main component
export default function TeamPage({}: {}) {
  const [team, setTeam] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  useState(() => {
    const fetchData = async () => {
      const teamsdata = await fetchAPI({ endpoint: "teams" });
      setTeam(teamsdata.data || []);
    };
    fetchData();
  });

  return (
    <>
      

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-20">
          {team.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-[200px] h-[200px] mb-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <TextHeader
                text={item.name}
                align="center"
                size="small"
                textcolor="text-primary"
                className="mb-1"
              />
              <p className="text-medium font-semibold text-gray-600">
                {item.position}
              </p>
              <TextDescription className="" text={item.shortinfo} />

              <div className="flex justify-center items-center gap-4 mt-3 text-gray-600">
                {item.socialLinks?.facebook && (
                  <a
                    href={item.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF size={18} className="text-[#0e334f]" />
                  </a>
                )}
                {item.socialLinks?.linkedin && (
                  <a
                    href={item.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn size={18} className="text-[#0e334f]" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedMember(item)}
                className="mt-4 text-sm text-primary hover:bg-primary/10"
              >
                View More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedMember && (
        <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </>
  );
}
