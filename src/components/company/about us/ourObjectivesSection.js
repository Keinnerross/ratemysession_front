import Image from "next/image";

export function OurObjectivesSection() {
    const objectives = [
        {
            title: "To Empower Clients",
            description: "We aim to give clients a voice in their therapy journey, allowing them to contribute to a wider conversation about mental health care."
        },
        {
            title: "To Support Therapists",
            description: "We seek to provide therapists with valuable feedback that helps them grow and improve their practices."
        },
        {
            title: "To Educate the Public",
            description: "By offering resources and insights, we want to help people understand the therapeutic process and find the right professional for their needs."
        },
        {
            title: "To Foster Trust",
            description: "Our goal is to establish a platform that encourages honesty, transparency, and respect in the mental health community, promoting better experiences for both clients and therapists."
        }
    ];

    return (
        <section className="relative py-32  bg-amethyst-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -left-96 -top-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/10 blur-3xl"></div>
            <div className="absolute -right-96 -bottom-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/20 blur-3xl"></div>

            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-medium text-stone-900 mb-6">
                        Our Objectives
                    </h2>
                    <p className="text-base font-light text-gray-500 max-w-2xl">
                        To provide a platform where people can share their experiences and
                        reviews of therapy sessions, fostering transparency in the mental
                        health field.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 pt-10">

                    {/* Objectives Grid */}
                    <div className="flex-1 grid md:grid-cols-2 gap-10">
                        {objectives.map((objective, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-2xl font-medium text-stone-700">
                                    {objective.title}
                                </h3>
                                <p className="text-base font-light text-gray-500 leading-relaxed ">
                                    {objective.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Visual Card */}
                    <div className="flex-1 relative flex  justify-end">
                        <div className="relative w-[90%] h-[400px] z-10 rounded-3xl overflow-hidden">
                            <Image src="/assets/about/objetives.png" alt="Illustration 1" fill className="object-cover object-center" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}