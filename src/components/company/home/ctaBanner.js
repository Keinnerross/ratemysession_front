export function CtaBanner() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amethyst-400 to-amethyst-700 px-8 py-16 lg:px-16 lg:py-24">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amethyst-500 opacity-30 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amethyst-600 opacity-20 blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amethyst-300 opacity-10 blur-3xl"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Real Insights for Your Mental Health
                        </h2>
                        <p className="text-lg lg:text-xl text-amethyst-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Make well-being choices with certainty. Explore genuine experiences
                            from others to gain insights and confidently decide on your best
                            path forward.
                        </p>
                        <button className="bg-fern-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-fern-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            View Recent Reviews
                        </button>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-8 right-8 w-20 h-20 rounded-full border-2 border-amethyst-300 opacity-20"></div>
                    <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full border-2 border-amethyst-300 opacity-20"></div>
                </div>
            </div>
        </section>
    );
}