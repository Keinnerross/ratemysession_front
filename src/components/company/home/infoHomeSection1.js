'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";

export function InfoHomeSection1() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useScrollAppear(
        sectionRef,
        () => setIsVisible(true),
        () => setIsVisible(false),
        0.3,
        100
    );

    return (
        <section 
            ref={sectionRef} 
            className="pt-36 bg-white overflow-hidden transition-all duration-700"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
            }}
        >
            <div className=" mx-auto max-w-[1440px] ">
                <div className="flex flex-col lg:flex-row items-center gap-38">
                    {/* Left side - Image/Illustration */}
                    <div className="flex-1 relative w-1/4">
                        <div className="relative w-full h-[500px] z-10 ">
                            <Image src="/assets/home/info_1.png" alt="Illustration 1" fill className="object-contain object-center" />
                        </div>

                        <div className="absolute -top-20 -left-10 w-[400px] h-[400px]">
                            <Image src="/assets/home/elipse.png" alt="Elipse" fill className="object-contain object-center" />
                        </div>

                    </div>
                    {/* Right side - Content */}
                    <div className="flex-1 max-w-xl">
                        <p className="text-fern-700 text-lg ">Real reviews. Smarter choices.</p>
                        <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-4 leading-tight">
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