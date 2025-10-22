import Image from "next/image";

export function HeroAbout() {
    return (
        <section className="relative w-full min-h-[800px] pb-20 pt-36 flex justify-center items-center bg-white">
            {/* Background gradient */}
            <div className="max-w-[1330px] w-full relative z-10">
                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl lg:text-6xl font-medium text-gray-800 leading-tight">
                        We want to drive growth in the
                        <br />
                        mental health community
                    </h1>
                </div>

                {/* Main Content Card */}

                <div className="w-full h-[550px] relative   rounded-3xl overflow-hidden">
                    <Image src="/assets/about/about-hero.png" alt="About Us Hero" fill className="object-cover object-center" />
                </div>

            </div>
        </section>
    );
}