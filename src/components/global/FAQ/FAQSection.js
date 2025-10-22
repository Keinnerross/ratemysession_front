'use client';
import { useState } from 'react';

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is ratemysession.com",
            answer: "RateMySession is a trusted platform where patients can share honest reviews about their therapy experiences. We help people find the right therapist by providing real insights from the community."
        },
        {
            question: "How do I write a review",
            answer: "Writing a review is simple. Create an account, search for your therapist, and share your experience. Be honest, respectful, and specific about what worked or didn't work for you."
        },
        {
            question: "Are reviews moderated",
            answer: "We moderate reviews to prevent spam and abuse and ensure they comply with our posting guidelines. Reviews suspected of being false or misleading are thoroughly investigated."
        },
        {
            question: "Can therapists respond to reviews",
            answer: "Yes, therapists can claim their profile and respond professionally to reviews. This creates a dialogue that helps both parties and provides more context for future patients."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto max-w-[1330px] px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left side - Title */}
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-medium text-stone-800 leading-tight sticky top-8">
                            Learn how to get started with RateMySession
                        </h2>
                    </div>

                    {/* Right side - FAQ Accordion */}
                    <div className="space-y-0">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border-t border-stone-700 ${
                                    index === faqs.length - 1 ? 'border-b' : ''
                                }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full py-6 flex justify-between items-center text-left "
                                >
                                    <h3 className="text-xl font-base text-stone-800 pr-4">
                                        {faq.question}
                                    </h3>
                                    <span className="text-4xl font-extralight text-stone-800 flex-shrink-0">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>
                                
                                {/* Expandable answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        openIndex === index ? 'max-h-48 pb-6' : 'max-h-0'
                                    }`}
                                >
                                    <p className="text-sm font-base text-stone-600 leading-relaxed pr-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}