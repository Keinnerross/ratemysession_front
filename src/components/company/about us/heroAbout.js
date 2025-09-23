import Image from "next/image";

export function HeroAbout() {
    return (
        <section className="relative w-full min-h-[800px] py-20">
            {/* Background gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-amethyst-50 to-transparent"></div>

            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl lg:text-6xl font-medium text-fern-950 leading-tight">
                        We want to drive growth in the
                        <br />
                        mental health community
                    </h1>
                </div>

                {/* Main Content Card */}
                <div className="relative bg-amethyst-500 rounded-3xl shadow-xl overflow-hidden h-[600px]">
                    {/* Top Section with People */}
                    <div className="absolute inset-0">
                        {/* Placeholder for main image */}
                        <div className="absolute top-0 left-0 w-full h-[300px] bg-amethyst-600 opacity-50">
                            {/* Add group image here */}
                        </div>

                        {/* Left person image placeholder */}
                        <div className="absolute top-6 left-0 w-52 h-64 bg-amethyst-400 opacity-30 rounded-r-2xl">
                            {/* Add person image here */}
                        </div>
                    </div>

                    {/* Bottom Cards Section */}
                    <div className="absolute bottom-0 left-0 right-0 h-[280px] flex gap-8 px-8 pb-8 overflow-x-auto">
                        {/* Card 1 - Therapist Profile */}
                        <div className="flex-shrink-0 w-[500px] h-full bg-amethyst-50 rounded-2xl overflow-hidden flex">
                            <div className="w-[200px] h-full bg-gray-200">
                                {/* Placeholder for therapist image */}
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-center">
                                <p className="text-sm text-gray-600 font-light">Family Therapist</p>
                                <h3 className="text-2xl text-gray-700 font-normal mt-2">Mary Triana</h3>
                            </div>
                        </div>

                        {/* Card 2 - Rating Chart */}
                        <div className="flex-shrink-0 w-[500px] h-full bg-amethyst-600 rounded-2xl overflow-hidden relative">
                            <div className="p-8">
                                <div className="flex gap-6 items-end">
                                    {/* Bar chart visualization */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-32 bg-amethyst-300 rounded"></div>
                                        <span className="text-white text-2xl">5</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-24 bg-amethyst-300 rounded"></div>
                                        <span className="text-white text-2xl">4</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-20 bg-amethyst-300 rounded"></div>
                                        <span className="text-white text-2xl">3</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-16 bg-amethyst-300 rounded"></div>
                                        <span className="text-white text-2xl">2</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-amethyst-300 rounded"></div>
                                        <span className="text-white text-2xl">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Additional Profile */}
                        <div className="flex-shrink-0 w-[200px] h-full bg-gray-200 rounded-2xl overflow-hidden">
                            {/* Placeholder for another image */}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button className="absolute bottom-20 left-60 bg-amethyst-400 text-white px-8 py-3 rounded-full text-sm font-normal hover:bg-amethyst-300 transition-colors">
                        Rate Therapist
                    </button>
                </div>
            </div>
        </section>
    );
}