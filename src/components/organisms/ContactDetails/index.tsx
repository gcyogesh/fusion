import React from 'react';
import { MdCall, MdEmail, MdLocationOn } from "react-icons/md";

const ContactDetails = ({ showDivider = true }) => {
  const contactDetails = [
    {
      icon: <MdCall className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      title: "",
      text: (
        <>
          <span>+977 985167629</span>
          <br />
          <span>+977 9851342767</span>
        </>
      ),
    },
    {
      icon: <MdEmail className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: "fusionexpeditions@gmail.com",
    },
    {
      icon: <MdLocationOn className="text-white bg-[#F28A15] rounded-full text-xl p-2 w-[34px] h-[34px]" />,
      text: "Saatghumti, Thamel, Kathmandu, Nepal",
    },
  ];

  return (
    <ul className="space-y-3">
      {contactDetails.map((item, index) => (
        <li key={index} className="flex items-center space-x-3 mb-2">
          <div>{item.icon}</div>
          <div>
            {item.title && <span className="font-bold">{item.title}</span>}
            <div>
              <span className="whitespace-nowrap">{item.text}</span>
              {showDivider && (
                <div className="w-auto md:w-[363px] h-[1px] bg-gray-300 mt-2" />
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactDetails;
