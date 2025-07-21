  'use client';

  import { useState } from 'react';
  import { Minus, Plus } from 'lucide-react';
  import TextHeader from '@/components/atoms/headings';

  interface FAQ {
    id: string;
    question: string;
    answer: string;
  }

  export default function FAQSection({ faqdata }: { faqdata: FAQ[] }) {
    const [openId, setOpenId] = useState<string | null>(faqdata[0]?.id || null);

    const toggleFAQ = (id: string) => {
      setOpenId(openId === id ? null : id);
    };

    return (
      <div className="w-full max-w-[400px] md:max-w-[710px] px-2 md:px-0 space-y-4">
        {faqdata.map((faq) => {
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
                <span className="text-xl font-semibold">{faq.question}</span>
                <span className="ml-6">
                  {isOpen ? (
                    <Minus className="w-10 h-10 text-white bg-primary rounded cursor-pointer" />
                  ) : (
                    <Plus className="w-10 h-10 text-white bg-primary rounded cursor-pointer" />
                  )}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 mt-2' : 'max-h-0'
                }`}
              >
                <p className="text-sm text-gray-800 w-full max-w-[600px] mr-1">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
