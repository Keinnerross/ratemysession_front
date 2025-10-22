import { SearchbarWithFilters } from "@/components/global/searchbars/searchbarWithFilters";
import { ButtonCustom } from "@/components/global/buttons/buttons";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

export function Hero() {
  return (
    <section className="relative bg-white w-full min-h-[500px] flex items-center pt-40 pb-16">
      <div className="container mx-auto max-w-[1330px] px-6 md:px-0 flex flex-col lg:flex-row items-center z-10 relative ">
        <div id="left-hero" className="flex-1 w-1/2 gap-10">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4 ">
              <FaStar className="text-fern-500" size={22} />
              <p className="text-stone-800 text-base font-base font-['poppins']">
                Hundreds of users share their experience.
              </p>
            </div>
            <h1 className="font-medium text-[4.5rem]/18   text-stone-800 pb-8  flex flex-col">
                <span> Your trusted </span>
                <span> resource to find </span>
                <span> therapist reviews </span>
            </h1>

            <p className="text-base font-base text-stone-700 leading-relaxed w-[90%] font-['poppins']">
              Finding a good therapist gets easier with the help of real, honest
              unbiased reviews - including yours!
            </p>
          </div>
          <div className="w-full mt-8 flex items-center gap-8">
            <ButtonCustom variant={1}>Get started—rate!</ButtonCustom>
            <a 
              className="flex gap-1 items-center cursor-pointer group relative"
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  window.location.hash = 'how-it-works';
                }
              }}
            >
              <p className="text-stone-800 transition-colors group-hover:text-stone-900 relative">
                Watch How It Works
              </p>
              <IoIosArrowRoundForward size={22} />
                <span className="absolute -bottom-[3px] left-0 w-0 h-[1px] bg-stone-700 transition-all duration-500 ease-out group-hover:w-full" />
            </a>




          </div>
        </div>
        <div id="right-hero" className="flex-1 w-1/2">
          <div className="relative w-full h-[520px]">
            <Image
              className="object-contain"
              src="/assets/home/hero_pic.png"
              alt="Therapist consultation illustration"
              fill
              priority
            />
            <div className="absolute -right-10 top-18 h-20 w-48">
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
      <div className="w-[800px] h-[800px] absolute -bottom-80 -right-80 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, #796BF520, transparent 70%)',
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out 1s forwards'
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

      <div className="w-[800px] h-[800px] absolute -top-80 -left-80 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, #796BF530, transparent 70%)',
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out 1s forwards'
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
