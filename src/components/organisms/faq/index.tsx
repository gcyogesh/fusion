    'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import TextHeader from '@/components/atoms/headings';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "faq1",
    question: "How do I book a trip through your website?",
    answer:
      "You can easily book by browsing destinations, selecting your travel package, and completing the booking form. Our team will follow up with confirmation and details!",
  },
  {
    id: "faq2",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital wallets like PayPal or Apple Pay.",
  },
  {
    id: "faq3",
    question: "Can I customize my travel itinerary?",
    answer: "Absolutely! Contact us with your preferences, and we’ll tailor your trip to your needs.",
  },
  {
    id: "faq4",
    question: "What is your cancellation policy?",
    answer: "Cancellations made within 7 days of departure may incur charges. Please see our full policy.",
  },
  {
    id: "faq5",
    question: "Do you offer travel insurance?",
    answer: "Yes, we partner with reputable insurance providers to offer you comprehensive travel protection.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
   

      <div className="w-full max-w-[400px] md:max-w-[710px] px-2 md:px-0 space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-xl p-6 text-black border border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
                isOpen ? 'bg-[#FCE1AC]' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-xl font-semibold">
                  {faq.question}
                </span>
                <span className="ml-6">
                  {isOpen ? (
                    <Minus className="w-10 h-10 text-white bg-primary rounded cursor-pointer " />
                  ) : (
                    <Plus className="w-10 h-10 text-white bg-primary rounded cursor-pointer" />
                  )}
                </span>
              </button>

              <div
                className={`transition-max-height duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 mt-2' : 'max-h-0 overflow-hidden'
                }`}
              >
               <p className="text-sm text-gray-800 w-full max-w-[600px] mr-1">
                  {faq.answer}
                </p>

               
              </div>
            </div>
          );
        })}
     

     
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>

  
  );
}