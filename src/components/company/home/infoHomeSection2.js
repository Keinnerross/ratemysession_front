export function InfoHomeSection2() {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left side - Content */}
                    <div className="flex-1 max-w-xl">
                        <p className="text-fern-700 text-lg mb-4">
                            Share your experience  anonymously.
                        </p>
                        
                        <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-6 leading-tight">
                            Your voice matters.
                        </h2>
                        
                        <p className="text-xl font-light text-stone-600 mb-8 leading-relaxed">
                            Help others by leaving a private review. We've built a safe space
                            where you can speak freely without revealing your identity.
                        </p>
                        
                        <button className="bg-amethyst-400 text-white px-8 py-3 rounded-full font-medium hover:bg-amethyst-500 transition-colors">
                            Write a review
                        </button>
                    </div>

                    {/* Right side - Illustration */}
                    <div className="flex-1 relative">
                        {/* Background decorative circle */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amethyst-100 opacity-20 blur-3xl"></div>
                        
                        {/* Main card */}
                        <div className="relative bg-fern-200 rounded-2xl p-8 overflow-hidden">
                            {/* Anonymous badge */}
                            <div className="bg-white px-6 py-3 rounded-lg inline-block mb-6">
                                <span className="text-2xl font-bold text-amethyst-400">Rate Anonymous</span>
                            </div>

                            {/* Review card */}
                            <div className="bg-amethyst-500 rounded-xl overflow-hidden flex h-64">
                                {/* Left side - Image placeholder */}
                                <div className="w-2/5 bg-yellow-600/30 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20"></div>
                                </div>
                                
                                {/* Right side - Content */}
                                <div className="w-3/5 p-6 flex flex-col justify-center text-white">
                                    <h3 className="font-semibold text-lg mb-4">
                                        Share your experience, privately
                                    </h3>
                                    <div className="bg-yellow-300 text-amethyst-700 px-4 py-1 rounded text-sm inline-block w-fit">
                                        Rate
                                    </div>
                                </div>
                            </div>

                            {/* User icon */}
                            <div className="absolute top-8 right-8 w-16 h-16 bg-amethyst-50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amethyst-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>

                            {/* Star rating */}
                            <div className="flex gap-1 mt-4 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-8 h-8 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Decorative triangle */}
                            <div className="absolute bottom-4 right-4 w-0 h-0 
                                border-l-[20px] border-l-transparent
                                border-t-[30px] border-t-amethyst-300
                                border-r-[20px] border-r-transparent">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}