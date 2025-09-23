export function InfoHomeSection1() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left side - Image/Illustration */}
                    <div className="flex-1 relative">
                        {/* Background decorative circle */}
                        <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-amethyst-100 opacity-30 blur-3xl"></div>
                        
                        {/* Profile blocks placeholder */}
                        <div className="relative z-10 space-y-4">
                            {/* Profile card examples */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm transform -rotate-3 hover:rotate-0 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-amethyst-200"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Dr. Sarah Johnson</h4>
                                        <p className="text-sm text-gray-600">Clinical Psychologist</p>
                                        <div className="flex text-yellow-400 text-sm mt-1">
                                            ★★★★★
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm ml-12 transform rotate-2 hover:rotate-0 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-fern-200"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Michael Chen, LMFT</h4>
                                        <p className="text-sm text-gray-600">Marriage & Family</p>
                                        <div className="flex text-yellow-400 text-sm mt-1">
                                            ★★★★☆
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm transform -rotate-2 hover:rotate-0 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-amethyst-300"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Dr. Emily Rivera</h4>
                                        <p className="text-sm text-gray-600">Anxiety Specialist</p>
                                        <div className="flex text-yellow-400 text-sm mt-1">
                                            ★★★★★
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 max-w-xl">
                        <p className="text-fern-700 text-lg mb-4">Real reviews. Smarter choices.</p>
                        
                        <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-6 leading-tight">
                            Gain Clarity<br />
                            Through Transparency
                        </h2>
                        
                        <p className="text-xl font-light text-stone-500 mb-8 leading-relaxed">
                            Make more informed choices about your mental health with
                            unfiltered ratings and reviews from clinicians, giving you
                            confidence in choosing quality providers
                        </p>
                        
                        <button className="bg-amethyst-400 text-white px-8 py-3 rounded-full font-medium hover:bg-amethyst-500 transition-colors">
                            Rate Therapist
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}