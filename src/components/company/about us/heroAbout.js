"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";

export function HeroAbout() {
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);

  useScrollAppear(
    titleRef,
    () => setIsTitleVisible(true),
    () => setIsTitleVisible(false),
    0.3,
    0
  );

  useScrollAppear(
    imageRef,
    () => setIsImageVisible(true),
    () => setIsImageVisible(false),
    0.3,
    200
  );

  return (
    <section className="relative max-w-[1330px] w-full pt-32 pb-16 md:pb-26 md:pt-36  md:min-h-[800px] flex justify-center items-center">
      <div className="w-full relative z-10 space-y-10 md:space-y-20">
        {/* Title */}
        <div
          ref={titleRef}
          className="text-center transition-all duration-700"
          style={{
            opacity: isTitleVisible ? 1 : 0,
          }}
        >
          <h1 className="text-4xl md:text-6xl font-medium text-gray-800 leading-tight px-6 md:px-0">
            We want to drive growth in the
            <br className="hidden md:block" />
            mental health community
          </h1>
        </div>

        {/* Main Content Card */}

        <div
          ref={imageRef}
          className="w-full h-[300px] md:h-[550px] relative md:rounded-3xl overflow-hidden transition-all duration-700"
          style={{
            opacity: isImageVisible ? 1 : 0,
            transform: isImageVisible ? "translateY(0)" : "translateY(50px)",
          }}
        >
          <Image
            src="/assets/about/about-hero.png"
            alt="About Us Hero"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
