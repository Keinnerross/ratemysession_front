import { SearchbarWithFilters } from "@/components/global/searchbars/searchbarWithFilters";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export function Hero() {
    return (
        <section className="relative bg-amethyst-50 w-full min-h-[500px] flex items-center pt-36 pb-10">
            <div className="container mx-auto max-w-[1280px] px-6 md:px-0 flex flex-col lg:flex-row items-center ">
                <div id="left-hero" className="flex-1 w-1/2">
                    <div className="w-[90%] pl-2">
                        <div className="flex items-center gap-2 mb-4" >
                            <FaStar className="text-fern-500" size={22} />
                            <p className="text-gray-800 text-base font-base">Hundreds of users share their experience.</p>
                        </div>
                        <h1 className="font-semibold text-5xl  text-gray-800 pb-6  ">Your trusted resource to find therapist reviews</h1>
                        <p className="text-lg font-base text-gray-800 leading-relaxed">Finding a good therapist gets easier with the help of real, honest unbiased reviews - including yours!</p>
                    </div>
                    <div className="max-w-full mt-6">
                        <SearchbarWithFilters />
                    </div>
                </div>
                <div id="right-hero" className="flex-1 w-1/2">
                    <div className="relative w-full h-[400px]">
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
                            /></div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[80%] absolute top-0 left-0  ">
                <Image src={"/assets/home/gradient-hero.png"} alt="Gradient" fill className="object-contain object-top-left" />
            </div>
        </section>
    );
}