// src\app\lp3\components\FAQSection.js
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What exactly do I get for ₹499?",
      answer: "You get a complete 3D design for one room, including furniture layout, color scheme, material specifications, and a detailed budget breakdown. If you're not satisfied, we offer a full refund."
    },
    {
      question: "How is this different from traditional designers?",
      answer: "Traditional designers charge 40-50% markup on materials and take weeks to deliver. We provide transparent pricing, direct vendor connections, and deliver complete designs in 72 hours with zero hidden costs."
    },
    {
      question: "Can I see designs before paying the full amount?",
      answer: "Yes! Start with our ₹499 Single Room Trial. Once you're satisfied, upgrade to the Complete Home package and we'll credit the ₹499 toward your total."
    },
    {
      question: "Do you handle the actual construction?",
      answer: "We provide complete designs, material specifications, and connect you with verified vendors. You can choose to work with our partner vendors or use your own contractors."
    },
    {
      question: "What if I don't like the design?",
      answer: "We offer different levels of revisions across our packages. Please review our package details to choose what suits you best."
    },
    {
      question: "How do you keep costs so low?",
      answer: "We eliminate middlemen markups by working directly with manufacturers and use technology to streamline the design process. Our transparent pricing model means you only pay for actual materials and services."
    }
  ];

  return (
    <section id="faq" className="bg-gradient-to-b from-white via-gray-50 to-white py-10 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 shadow-lg">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight px-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">
            Everything you need to know about our service
          </p>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-4 sm:mt-5 rounded-full"></div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg sm:rounded-xl shadow-md border transition-all duration-300 overflow-hidden ${openFAQ === index
                  ? 'border-orange-300 shadow-xl scale-[1.01]'
                  : 'border-gray-200 hover:border-orange-200 hover:shadow-lg'
                }`}
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-left flex items-center justify-between group"
              >
                <span className={`font-semibold text-xs sm:text-sm md:text-base pr-4 sm:pr-6 transition-colors leading-relaxed ${openFAQ === index ? 'text-orange-600' : 'text-gray-900 group-hover:text-orange-600'
                  }`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === index
                    ? 'bg-orange-100 text-orange-600 rotate-180'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-600'
                  }`}>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>
              {openFAQ === index && (
                <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base pt-2 sm:pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-orange-200 shadow-xl">
          <div className="mb-4 sm:mb-5">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              We're here to help! Chat with us anytime.
            </p>
          </div>
          <button
            onClick={() => window.open('https://wa.me/7075957625?text=Hi%20I%20have%20a%20question%20about%20Houspire', '_blank')}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-lg sm:text-xl">💬</span>
            <span>Chat with us on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
}
