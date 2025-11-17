"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";
import { ButtonCustom } from "@/components/global/buttons/buttons";

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
      className="pt-12 md:pt-32 lg:pt-50 pb-0 md:pb-0 bg-white overflow-hidden transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
      }}
    >
      <div className="mx-auto max-w-[1330px] px-6 md:px-8 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16 lg:gap-38">
          {/* Left side - Image/Illustration */}
          <div className="flex-1 relative w-full lg:w-1/4">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] z-10">
              <Image
                src="/assets/home/info_1.png"
                alt="Illustration 1"
                fill
                className="object-contain object-center"
              />
            </div>

            <div className="absolute -top-10 md:-top-20 -left-5 md:-left-10 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px]">
              <Image
                src="/assets/home/elipse.png"
                alt="Elipse"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>
          {/* Right side - Content */}
          <div className="flex-1 max-w-xl order-first lg:order-last">
            <p className="text-fern-700 text-base md:text-lg">
              Real reviews. Smarter choices.
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-4 md:mb-6 leading-tight">
              Gain Clarity
              <br />
              Through Transparency
            </h2>
            <p className="text-sm md:text-base font-base text-stone-600 mb-6 md:mb-8 leading-relaxed">
              Make more informed choices about your mental health with
              unfiltered ratings and reviews from clinicians, giving you
              confidence in choosing quality providers
            </p>
              <ButtonCustom href="/search" variant={1}>
                Rate Therapist
              </ButtonCustom>
          </div>
        </div>
      </div>
    </section>
  );
}
