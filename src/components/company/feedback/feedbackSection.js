'use client';

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
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Uncover the power of your experience
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're always looking to improve. Your feedback helps us create better
                        experiences for everyone.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Feedback Form */}
                    <div className="bg-white rounded-3xl border border-amethyst-200 p-10">
                        <h2 className="text-3xl font-medium text-black mb-8">
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
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amethyst-300 transition-colors"
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
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amethyst-300 transition-colors"
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
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-amethyst-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amethyst-300 transition-colors resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-amethyst-500 text-white font-bold py-3 px-6 rounded-full hover:bg-amethyst-600 transition-colors"
                            >
                                Submit Now
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Image or Illustration */}
                    <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden border border-gray-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-amethyst-100 to-fern-100 opacity-50"></div>
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-64 h-64 mx-auto mb-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg className="w-32 h-32 text-amethyst-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-light text-gray-700">Thank you for helping us improve</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}