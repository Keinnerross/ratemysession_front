'use client';

import { ButtonCustom } from "@/components/global/buttons/buttons";
import Image from "next/image";
import { useRef, useState } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";

export function InfoHomeSection2() {
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
            className="pb-20 pt-10 bg-white overflow-visible transition-all duration-700"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
            }}
        >
            <div className=" mx-auto max-w-[1440px] ">
                <div className="flex flex-col lg:flex-row items-center gap-38">
                    {/* Left side - Image/Illustration */}


                    <div className="flex-1 max-w-xl">
                        <p className="text-fern-700 text-lg ">Share your experience — anonymously.</p>
                        <h2 className="text-4xl lg:text-5xl font-medium text-gray-900 leading-tight pb-4">
                            Your voice matters.
                        </h2>
                        <p className="text-lg font-light text-stone-500 mb-8 leading-relaxed w-[85%]">
                          Help others by leaving a private review. We’ve built a safe space where you can speak freely without revealing your identity.
                        </p>
                       <ButtonCustom variant={1}>Write a review</ButtonCustom>
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 relative w-1/4">
                        <div className="relative w-full h-[500px] z-10 ">
                            <Image src="/assets/home/info_2.png" alt="Illustration 1" fill className="object-contain object-center" />
                        </div>

                        <div className="absolute -top-20 -right-16 w-[400px] h-[400px]">
                            <Image src="/assets/home/elipse.png" alt="Elipse" fill className="object-contain object-center" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}