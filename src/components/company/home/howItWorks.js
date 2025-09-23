import { ButtonCustom } from "@/components/global/buttons/buttons";

export function HowItWorks() {
    const steps = [
        {
            title: "Search a Therapist",
            description: "Use the search bar to explore real reviews on therapists near you.",
            bgColor: "bg-amethyst-400",
            icon: (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            title: "Read Experiences",
            description: "Check what others say before making a decision.",
            bgColor: "bg-fern-600",
            icon: (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: "Leave a Review",
            description: "Share your honest opinion to help the next person.",
            bgColor: "bg-amethyst-500",
            icon: (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            )
        }
    ];

    return (
        <section id="how-it-works" className="relative bg-white pt-10 pb-20 w-full">

            {/*Gradient */}
            <div className="absolute top-0 left-0 w-full  bg-gradient-to-b from-amethyst-50 to-white h-[300px]" />

            {/* Content */}
            <div className="z-10  relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl  font-medium text-gray-900 ">
                        How it works
                    </h2>
                </div>


                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-[1280px] mx-auto px-6 md:px-0">
                    {steps.map((step, index) => (
                        <div key={index} className={`w-full max-w-xs ${index === 1 ? 'transform scale-[1.1]' : ''}`}>

                            <div className="bg-white rounded-3xl border border-amethyst-100 p-6 flex flex-col items-center text-center h-full">
                                {/* Icon Circle */}
                                <div className={`w-14 h-14 rounded-full ${step.bgColor} flex items-center justify-center mb-4`}>
                                    {step.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <ButtonCustom variant={1}>Search therapist reviews</ButtonCustom>
                </div>
            </div>
        </section>
    );
}