import React from 'react';
import { MdCall, MdEmail, MdLocationOn, MdWhatsapp } from "react-icons/md";

interface ContactDetailsProps {
  contactInfo: {
    phone?: string;
    whatsappNumber?: string;
    email?: string;
    address?: string;
  };
  showDivider?: boolean;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contactInfo, showDivider = true }) => {
  const contactDetails = [
    {
      icon: <MdCall className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: contactInfo.phone || "",
    },
    {
      icon: <MdWhatsapp className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: contactInfo.whatsappNumber || "",
    },
    {
      icon: <MdEmail className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: contactInfo.email || "",
    },
    {
      icon: <MdLocationOn className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: contactInfo.address || "",
    },
  ];

  return (
    <ul className="space-y-3">
      {contactDetails.map((item, index) => (
        <li key={index} className="flex items-center space-x-3 mb-2">
          <div>{item.icon}</div>
          <div>
            <span className="whitespace-nowrap">{item.text}</span>
            {showDivider && (
              <div className="w-auto md:w-[363px] h-[1px] bg-gray-300 mt-2" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactDetails;

