import Image from "next/image";

export function Hero() {
    return (
        <section className="bg-amethyst-50 w-full min-h-[600px] flex items-center py-16">
            <div className="container mx-auto max-w-[1280px] px-6 md:px-0 flex flex-col lg:flex-row items-center gap-12">
                <div id="left-hero" className="flex-1 space-y-6">
                    <p className="text-amethyst-700 text-sm font-medium">Hundreds of users share their experience.</p>
                    <h1 className="font-bold text-5xl lg:text-6xl text-amethyst-900 leading-tight">Your trusted resource to find therapist reviews</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">Finding a good therapist gets easier with the help of real, honest unbiased reviews - including yours!</p>
                    <div className="pt-4">
                        <input 
                            type="text" 
                            placeholder="Search therapist reviews..." 
                            className="w-full md:w-96 px-6 py-4 border-2 border-amethyst-200 rounded-full text-lg focus:outline-none focus:border-amethyst-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="relative w-full h-[400px] lg:h-[500px]">
                        <Image 
                            className="object-contain" 
                            src="/assets/home/hero_pic.png" 
                            alt="Therapist consultation illustration" 
                            fill 
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}