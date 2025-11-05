import Image from "next/image";
import {objectives} from "@/data/about/objetives"
export function OurObjectivesSection() {
    

    return (
        <section className="relative w-full py-16 md:py-24 lg:py-32 bg-[#E6E9FF] overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -left-96 -top-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/10 blur-3xl"></div>
            <div className="absolute -right-96 -bottom-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/20 blur-3xl"></div>
            <div className="container mx-auto max-w-[1330px] relative z-10 px-6 md:px-0">
                {/* Header */}
                <div className="mb-8 lg:mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium text-stone-900 mb-4 md:mb-6">
                        Our Objectives
                    </h2>
                    <p className="text-sm md:text-base text-stone-600 max-w-2xl">
                        To provide a platform where people can share their experiences and
                        reviews of therapy sessions, fostering transparency in the mental
                        health field.
                    </p>

                      <div className="md:hidden flex-1 relative flex justify-center lg:justify-end pt-12 pb-6">
                        <div className="relative w-full lg:w-[90%] h-[250px] md:h-[400px] z-10 rounded-3xl overflow-hidden">
                            <Image src="/assets/about/objetives.png" alt="Illustration 1" fill className="object-cover object-center" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10  lg:pt-10">

                    {/* Objectives Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {objectives.map((objective, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-medium text-stone-900">
                                    {objective.title}
                                </h3>
                                <p className="text-sm text-stone-600 leading-relaxed ">
                                    {objective.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Visual Card */}
                    <div className="hidden flex-1 relative md:flex justify-center lg:justify-end">
                        <div className="relative w-full lg:w-[90%] h-[250px] md:h-[400px] z-10 rounded-3xl overflow-hidden">
                            <Image src="/assets/about/objetives.png" alt="Illustration 1" fill className="object-cover object-center" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}