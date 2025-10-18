'use client';

import { ButtonCustom } from "@/components/global/buttons/buttons";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";

export function CtaBanner() {
  const sectionRef = useRef(null);
  const [expansionProgress, setExpansionProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useScrollAppear(
    sectionRef,
    () => {
      setIsVisible(true);
      setOpacity(1);
    },
    () => {
      setIsVisible(false);
      setOpacity(0);
      setExpansionProgress(0);
    },
    0.2,
    100
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isVisible) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress through the viewport
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      // Start expanding after element is 30% visible
      if (scrollProgress > 0.3) {
        // Normalize progress from 0.3-0.8 to 0-1 (complete by 80% scroll)
        const normalizedProgress = Math.min(1, (scrollProgress - 0.3) / 0.5);
        setExpansionProgress(normalizedProgress);
      } else {
        setExpansionProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // Calculate values based on progress
  const [windowWidth, setWindowWidth] = useState(1920);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxWidth = 1440 + (windowWidth - 1440) * expansionProgress;
  const padding = 16 * (1 - expansionProgress); // 16px = 1rem
  const borderRadius = 60 * (1 - expansionProgress);
  const scale = 1 + (0.2 * expansionProgress); // Scale from 1 to 1.2

  return (
    <section ref={sectionRef} className="pt-6 pb-10 overflow-hidden">
      <div 
        className="container mx-auto transition-none"
        style={{
          maxWidth: `${maxWidth}px`,
          padding: `0 ${padding}px`,
        }}
      >
        <div 
          className="relative overflow-hidden w-full h-[560px] flex justify-center items-center transition-opacity duration-300"
          style={{
            borderRadius: `${borderRadius}px`,
            transform: `scale(${scale})`,
            opacity: opacity,
          }}
        >
          {/* bgImage  */}
          <div className="absolute  w-full h-full">
            <Image
              src={"/assets/home/bg-gradient-cta.png"}
              alt="Gradient"
              fill
              className=" bg-amethyst-300 object-cover object-center "
            />
            <div className="bg-amethyst-300"></div>
          </div>
          {/* Content */}
          <div 
            className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 transition-opacity duration-700"
            style={{
              transform: `translateY(${30 * (1 - expansionProgress)}px)`,
              opacity: opacity,
            }}
          >
            {/* <h2 className="text-[3.7rem]/16 font-base text-white   w-[70%]"> */}
              <h2 className="text-[3.5rem]/14 font- text-white flex flex-col ">
                <span> Make confident choices </span>
                <span> for your well-being and find </span>
                <span> your path through </span>
                <span> real experiences.</span>
              </h2>
            {/* </h2> */}
            <p className="text-lg font-base text-white max-w-2xl mx-auto leading-relaxed w-full">
              Real insights to better understand, improve, and care for your mental health.
            </p>
            <ButtonCustom variant={2}>View Recents Reviews</ButtonCustom>
          </div>
        </div>
      </div>
    </section>
  );
}
