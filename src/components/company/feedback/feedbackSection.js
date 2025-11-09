'use client';

import Image from 'next/image';
import { useState } from 'react';

export function FeedbackSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedback: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="pb-6 pt-32 md:pt-40 lg:pt-48 bg-amethyst-50 relative overflow-hidden">

            <div className='absolute w-[500px] md:w-[750px] lg:w-[1000px] h-[500px] md:h-[750px] lg:h-[1000px] -top-[250px] md:-top-[375px] lg:-top-[500px] -left-[250px] md:-left-[375px] lg:-left-[500px] opacity-20 md:opacity-25 lg:opacity-30 z-10'>
                <Image src={"/assets/feedback/ellipse.png"} alt="Feedback Illustration" fill className="object-cover" />
            </div>


            <div className='absolute w-[500px] md:w-[750px] lg:w-[1000px] h-[500px] md:h-[750px] lg:h-[1000px] top-0 -right-[250px] md:-right-[375px] lg:-right-[500px] opacity-15 md:opacity-20 lg:opacity-25 z-10'>
                <Image src={"/assets/feedback/ellipse.png"} alt="Feedback Illustration" fill className="object-cover" />
            </div>





            <div className="container mx-auto max-w-[1440px] px-6 md:px-8 lg:px-6 relative z-20">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12 flex flex-col items-center w-full">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8 lg:mb-10 w-full md:w-[70%] lg:w-[40%]">
                        Uncover the power of your experience
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        We're always looking to improve. Your feedback helps us create better
                        experiences for everyone.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start pt-6 md:pt-8 lg:pt-10 pb-0 md:pb-24 lg:pb-32">
                    {/* Feedback Form */}
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-amethyst-200 p-6 md:p-8 lg:p-10">
                        <h2 className="text-2xl md:text-3xl font-medium text-black mb-6 md:mb-8">
                            Feedback Form
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amethyst-300 transition-colors text-sm md:text-base"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amethyst-300 transition-colors text-sm md:text-base"
                                    required
                                />
                            </div>

                            {/* Feedback Textarea */}
                            <div className="relative">
                                <div className="absolute top-4 left-4 pointer-events-none">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <textarea
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleChange}
                                    placeholder="Your Feedback"
                                    rows={8}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amethyst-300 transition-colors resize-none text-sm md:text-base"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-amethyst-500 text-white font-bold py-3 px-6 rounded-full hover:bg-amethyst-600 transition-colors text-sm md:text-base"
                            >
                                Submit Now
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Image or Illustration */}
                    <div className="hidden md:block relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 order-first lg:order-last">
                        <Image src={"/assets/feedback/feedback_pic.png"} alt="Feedback Illustration" fill className="object-cover object-center" />
                    </div>
                </div>
            </div>



            <div className='w-full h-[300px] md:h-[450px] lg:h-[600px] bg-gradient-to-b from-amethyst-50 to-white absolute bottom-0' />



        </section>
    );
}