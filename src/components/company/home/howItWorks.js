"use client";

import { ButtonCustom } from "@/components/global/buttons/buttons";
import { FaPlay } from "react-icons/fa";
import { useRef, useState } from "react";
// import { useScrollAppear } from "@/utils/scrollAppear";

export function HowItWorks() {
  const sectionRef = useRef(null);
  // const [isVisible, setIsVisible] = useState(false);

  // useScrollAppear(
  //   sectionRef,
  //   () => setIsVisible(true),
  //   () => setIsVisible(false),
  //   0.5, // Cambiado de 0.3 a 0.5 para activar a la mitad
  //   100
  // );

  const steps = [
    {
      title: "Search a Therapist",
      description:
        "Use the search bar to explore real reviews on therapists near you.",
      bgColor: "bg-amethyst-400",
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Read Experiences",
      description: "Check what others say before making a decision.",
      bgColor: "bg-fern-600",
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      title: "Leave a Review",
      description: "Share your honest opinion to help the next person.",
      bgColor: "bg-amethyst-500",
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-transparent pt-10 pb-32 w-full"
    >
      {/*Gradient */}
      {/* <div className="absolute top-0 left-0 w-full  bg-gradient-to-b from-amethyst-50 to-white h-[300px]" /> */}

      {/* Content */}
      <div
        className="z-10 relative"
        // style={{
        //   opacity: isVisible ? 1 : 0,
        //   transform: isVisible ? "translateY(0)" : "translateY(50px)",
        // }}
      >
        <div className="text-center pb-12">
          <h2 className="text-[2.6rem] font-semibold text-gray-800 ">
            How it works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="flex justify-between max-w-[1330px] mx-auto pb-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-full max-w-[400px] cursor-pointer  ${
                index === 1
                  ? "mx-8"
                  : ""
              }`}
            >
              <div className="bg-white rounded-3xl border border-amethyst-100 px-6  py-8 flex flex-col items-center text-center h-full">
                {/* Icon Circle */}
                <div
                  className={`w-14 h-14 rounded-full ${step.bgColor} flex items-center justify-center mb-4`}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className=" flex justify-center items-center gap-4 pt-[50px] ">
          <ButtonCustom variant={1}>Search therapist reviews</ButtonCustom>
          <a className="flex gap-2 items-center cursor-pointer group relative">
            <FaPlay
              className="text-gray-800 transition-colors group-hover:text-gray-900"
              size={10}
            />
            <p className="text-gray-800 transition-colors group-hover:text-gray-900 relative">
              Watch How It Works
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-500 ease-out group-hover:w-full" />
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
