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
        <section className="relative py-20 bg-amethyst-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -left-96 -top-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/30 blur-3xl"></div>
            <div className="absolute -right-96 -bottom-96 w-[800px] h-[800px] rounded-full bg-amethyst-400/20 blur-3xl"></div>

            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-5xl font-medium text-stone-900 mb-6">
                        Our Objectives
                    </h2>
                    <p className="text-lg font-light text-gray-500 max-w-2xl">
                        To provide a platform where people can share their experiences and
                        reviews of therapy sessions, fostering transparency in the mental
                        health field.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Objectives Grid */}
                    <div className="flex-1 grid md:grid-cols-2 gap-8">
                        {objectives.map((objective, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-2xl font-normal text-stone-700">
                                    {objective.title}
                                </h3>
                                <p className="text-lg font-light text-gray-500 leading-relaxed">
                                    {objective.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Visual Card */}
                    <div className="lg:w-[500px]">
                        <div className="relative bg-fern-200 rounded-2xl p-8 h-[400px] overflow-hidden">
                            {/* Main card */}
                            <div className="absolute bottom-8 left-8 right-8 bg-amethyst-500 rounded-2xl h-[250px] overflow-hidden">
                                <div className="flex h-full">
                                    {/* Image placeholder */}
                                    <div className="w-3/5 bg-amethyst-600/20">
                                        {/* Add therapist image here */}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="w-2/5 p-6 flex flex-col justify-center">
                                        <h4 className="text-white font-semibold text-lg mb-4">
                                            Build Real Trust
                                        </h4>
                                        <div className="bg-yellow-300 text-amethyst-700 px-4 py-1 rounded text-sm w-fit">
                                            Rate
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top decorative elements */}
                            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded">
                                <span className="text-3xl font-bold text-amethyst-500">Rate</span>
                            </div>

                            {/* Star rating */}
                            <div className="absolute top-1/2 right-6 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-6 h-6 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Puzzle piece decoration */}
                            <div className="absolute top-6 right-6 w-20 h-20">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-amethyst-400 opacity-20">
                                    <path fill="currentColor" d="M30,20 Q30,10 40,10 L60,10 Q70,10 70,20 L70,30 Q80,30 80,40 L80,60 Q80,70 70,70 L70,80 Q70,90 60,90 L40,90 Q30,90 30,80 L30,70 Q20,70 20,60 L20,40 Q20,30 30,30 Z" />
                                </svg>
                            </div>

                            {/* Triangle decoration */}
                            <div className="absolute bottom-4 right-4 w-8 h-8 transform rotate-45 bg-amethyst-300"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}