'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CtaBanner } from "@/components/company/home/ctaBanner";
import { FAQSection } from "@/components/global/FAQ/FAQSection";
import { Hero } from "@/components/company/home/hero";
import { HowItWorks } from "@/components/company/home/howItWorks";
import { RecentActivitiesSection } from "@/components/company/home/recentActivitiesSection";
import { InfoHomeSection1 } from "@/components/company/home/infoHomeSection1";
import { InfoHomeSection2 } from "@/components/company/home/infoHomeSection2";

export default function Home() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if we need to scroll to a section
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [searchParams]);

  return (
    <div className="">

      <Hero />
      <HowItWorks />
      <CtaBanner />
      <InfoHomeSection1 />
      <InfoHomeSection2 />
      <RecentActivitiesSection />
      <FAQSection />
    </div>
  );
}
