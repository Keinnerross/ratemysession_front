import { PeopleBehindCard } from "@/components/company/about us/components/peopleBehindCard";
import { HeroAbout } from "@/components/company/about us/heroAbout";
import { InfoAboutSection } from "@/components/company/about us/infoAboutSection";
import { OurObjectivesSection } from "@/components/company/about us/ourObjectivesSection";
import { PeopleBehindSection } from "@/components/company/about us/peopleBehindSection";
import { FAQSection } from "@/components/global/FAQ/FAQSection";

export default function About() {
  return (
    <div className="flex flex-col items-center">
        <HeroAbout />
        <InfoAboutSection />
        <OurObjectivesSection />
        <PeopleBehindSection />
        <FAQSection />
    </div>
  );
}
