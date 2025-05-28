import React from 'react'
import { MdCall, MdEmail, MdLocationOn } from "react-icons/md";

const ContactDetails = () => {
    
    const contactDetails = [
        {
          icon: <MdCall  className="text-white bg-orange-500 rounded-full text-xl p-2 w-[34px] h-[34px] " />,
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
          icon: <MdEmail className="text-white bg-orange-500 rounded-full text-xl p-2 w-[34px] h-[34px]" />,
          title: "Email",
          text: "fusionexpeditions@gmail.com",
        },
        {
          icon: <MdLocationOn className="text-white bg-orange-500 rounded-full text-xl p-2 w-[34px] h-[34px]" />,
          title: "Address",
          text: "Saatghumti, Thamel, Kathmandu, Nepal",
        },
      ];
      
  return (
    <div>

   {contactDetails.map((item, index) => (
           <li key={index} className="flex items-center space-x-3">
          <div>{item.icon}</div>
          <div>
        {item.title && <span className="font-bold">{item.title}</span>}
        <div>
        <span className="whitespace-nowrap">{item.text}</span>
        </div>
      </div>
    </li>
  ))}

    </div>
  )
}

export default ContactDetails