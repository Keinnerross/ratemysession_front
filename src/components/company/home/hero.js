"use client";

import { SearchbarWithFilters } from "@/components/global/searchbars/searchbarWithFilters";
import { ButtonCustom } from "@/components/global/buttons/buttons";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { SearchbarBasic } from "@/components/global/searchbars/searchBarBasic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useTypewriter } from "@/utils/useTypewriter";
import { useScrollAppear } from "@/utils/scrollAppear";

export function Hero() {
  const router = useRouter();
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const placeholderText = useTypewriter([
    "Search therapist reviews",
    "Find the right therapist for you",
    "Read honest patient experiences"
  ]);

  useScrollAppear(
    contentRef,
    () => setIsVisible(true),
    () => setIsVisible(false),
    0.3,
    100
  );
  
  const handleSearch = (value) => {
    // Mark that we're applying a search
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('search-filter-applied', 'true');
    }
    
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    } else {
      router.push("/search");
    }
  };
  return (
    <section className="relative bg-gradient-to-b from-amethyst-50 to-white  w-full md:min-h-[570px] lg:min-h-screen flex items-center pt-30 md:pt-32 lg:pt-40 pb-22 md:pb-48 overflow-hidden">
      <div
        ref={contentRef}
        className="container mx-auto max-w-[1330px] px-6 md:px-8 lg:px-0 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-0 z-10 relative transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
        }}
      >
        <div id="left-hero" className="flex-1 w-full lg:w-1/2 gap-10">
          <div className="w-full text-center md:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <FaStar className="text-fern-500" size={22} />
              <p className="text-stone-800 text-sm md:text-lg font-base font-['poppins']">
                Hundreds of users share their experience.
              </p>
            </div>
            <h1 className="font-medium text-[30px]/8 md:text-5xl lg:text-[4.5rem]/18 text-stone-800 pb-6 md:pb-8  md:hidden flex">
              Your trusted resource to find therapist reviews
            </h1>
            <h1 className="font-medium text-4xl md:text-5xl lg:text-[3.9rem] text-stone-800 pb-6 md:pb-8 hidden md:flex flex-col">
              <span> Your trusted resource to </span>
              <span> find therapist reviews </span>
            </h1>

            <p className="text-sm md:text-lg font-base text-stone-700 leading-relaxed w-full lg:w-[90%] font-['poppins']">
              Finding a good therapist gets easier with the help of real, honest
              unbiased reviews - including yours!
            </p>
          </div>
          <div className="pt-8 md:pt-8">
            <SearchbarBasic
              onSearch={handleSearch}
              placeholder={placeholderText}
              className="py-3 border-amethyst-200"
            />
          </div>
        </div>
        <div
          id="right-hero"
          className="flex-1 w-full lg:w-1/2 order-first lg:order-last"
        >
          <div className="relative w-full h-[350px] md:h-[400px] lg:h-[510px]">
            <Image
              className="object-contain"
              src="/assets/home/hero_pic.png"
              alt="Therapist consultation illustration"
              fill
              priority
            />
            <div className="absolute -right-5 md:-right-10 top-12 md:top-18 h-16 md:h-20 w-36 md:w-48">
              <Image
                className="object-contain"
                src="/assets/home/stars-hero.png"
                alt="Therapist consultation illustration"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[400px] md:w-[600px] lg:w-[1000px] h-[400px] md:h-[600px] lg:h-[1000px] absolute -bottom-40 md:-bottom-60 lg:-bottom-10 -right-40 md:-right-60 lg:-right-80 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle at center, #796BF530, transparent 70%)",
            opacity: 0,
            animation: "fadeIn 1s ease-in-out 1s forwards",
          }}
        />
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>

      <div className="w-[400px] md:w-[600px] lg:w-[1000px] h-[400px] md:h-[600px] lg:h-[1000px] absolute -top-40 md:-top-60 lg:-top-100 -left-40 md:-left-60 lg:-left-100 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle at center, #796BF530, transparent 70%)",
            opacity: 0,
            animation: "fadeIn 1s ease-in-out 1s forwards",
          }}
        />
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
