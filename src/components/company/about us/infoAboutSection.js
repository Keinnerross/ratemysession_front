import Image from "next/image";
import Link from "next/link";

export function InfoAboutSection() {
    return (
        <section className="pt-20 pb-38 bg-white">
            <div className="container mx-auto max-w-7xl space-y-20">
                {/* Our History Section */}
                <div className="flex flex-col lg:flex-row items-center gap-36">
                    {/* Left Image */}
                    <div className="flex-1 relative">
                        <div className="relative w-full h-[500px] z-10 rounded-3xl overflow-hidden">
                            <Image src="/assets/about/about-1.png" alt="Illustration 1" fill className="object-cover object-center" />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 max-w-xl relative">








                        <h2 className="text-5xl font-medium text-stone-700 mb-8">
                            Our History
                        </h2>
                        <p className="text-base font-light text-gray-500 leading-relaxed mb-8">
                            Founded in 2025, Rate My Session was born from the need for a
                            platform that could bridge the gap between therapy seekers and the
                            professionals who guide them.
                            <br /><br />
                            The idea emerged from the understanding that finding the right
                            therapist can be overwhelming, and sometimes the decision is made
                            without adequate information. We wanted to create a space where
                            people could share their experiences, learn from one another, and
                            feel empowered in their mental health journey.
                        </p>
                        <Link
                            href="/learn-more"
                            className="inline-flex items-center gap-3 bg-amethyst-400 text-white px-6 py-3 rounded-full hover:bg-amethyst-500 transition-colors"
                        >
                            Learn more
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <div className="absolute -top-20 -right-10 w-[400px] h-[400px] opacity-70">
                            <Image src="/assets/about/elipse.png" alt="Elipse" fill className="object-contain object-center" />
                        </div>





                    </div>
                </div>

                {/* Our Mission Section */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
                    {/* Right Image */}
                    <div className="flex-1 relative">
                        <div className="relative w-full h-[500px] z-10 rounded-3xl overflow-hidden">
                            <Image src="/assets/about/about-2.png" alt="Illustration 1" fill className="object-cover object-center" />
                        </div>
                    </div>

                    {/* Left Content */}
                    <div className="flex-1 max-w-xl relative">
                        <p className="text-fern-700 text-lg mb-4">How we're giving back</p>
                        <h2 className="text-5xl font-medium text-stone-800 mb-8">
                            Our Mission
                        </h2>
                        <p className="text-base font-light text-gray-500 leading-relaxed mb-8">
                            At Rate My Session, we believe that transparency and open
                            communication are key to fostering trust and growth in the mental
                            health community.
                            <br /><br />
                            Our mission is to provide individuals with a platform to share
                            their therapy experiences, empowering others to make informed
                            decisions about their mental health care while helping therapists
                            refine their practice through constructive feedback.
                        </p>
                        <Link
                            href="/join-us"
                            className="inline-flex items-center gap-3 bg-amethyst-400 text-white px-6 py-3 rounded-full hover:bg-amethyst-500 transition-colors"
                        >
                            Join us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-70">
                            <Image src="/assets/about/elipse.png" alt="Elipse" fill className="object-contain object-center" />
                        </div>



                    </div>
                </div>
            </div>
        </section>
    );
}