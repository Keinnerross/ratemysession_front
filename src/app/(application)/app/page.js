'use client';
export default function ApplicationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amethyst-50 to-fern-50 flex items-center justify-center p-6">
            <div className="text-center max-w-2xl">
                {/* Construction Illustration */}
                <div className="relative mb-8">
                    <div className="w-80 h-80 mx-auto relative">
                        {/* Gear animations */}
                        <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-8 border-amethyst-300 border-t-amethyst-600 animate-spin"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full border-6 border-fern-300 border-t-fern-600 animate-spin-reverse"></div>
                        
                        {/* Main construction icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-40 h-40 text-amethyst-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-20 right-5 w-4 h-4 bg-fern-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 left-5 w-3 h-3 bg-amethyst-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    Under Construction
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    We're building something amazing for you!
                </p>
                <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto">
                    Our application platform is currently being developed with cutting-edge features 
                    to provide you with the best therapy session tracking experience.
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-amethyst-500 to-fern-500 h-3 rounded-full w-[65%] animate-width"></div>
                    </div>
                </div>

                {/* CTA */}
                <div className="space-y-4">
                    <p className="text-gray-600">Expected launch: Q2 2025</p>
                    <button className="bg-amethyst-600 text-white px-8 py-3 rounded-full font-medium hover:bg-amethyst-700 transition-colors">
                        Notify me when ready
                    </button>
                </div>
            </div>

            {/* CSS for custom animations */}
            <style jsx>{`
                @keyframes spin-reverse {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }
                
                @keyframes width {
                    0%, 100% {
                        width: 65%;
                    }
                    50% {
                        width: 70%;
                    }
                }
                
                .animate-spin-reverse {
                    animation: spin-reverse 3s linear infinite;
                }
                
                .animate-width {
                    animation: width 3s ease-in-out infinite;
                }
                
                .delay-300 {
                    animation-delay: 300ms;
                }
            `}</style>
        </div>
    );
}