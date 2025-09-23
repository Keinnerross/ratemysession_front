import { PeopleBehindCard } from "./components/peopleBehindCard";


export function PeopleBehindSection() {
    const teamMembers = [
        {
            name: "Dana Horowitz",
            role: "Chief Executive Officer",
            description: "Dana brings deep expertise in scaling operations, ensuring RateMySession grows efficiently while staying customer-focused.",
            linkedIn: "#",
            twitter: "#",
            picture: "/assets/about/team_3.png"

        },
        {
            name: "Caleb Piero",
            role: "Chief Operating Officer",
            description: "Caleb's strategic vision and passion for mental health make him the driving force behind RateMySession's innovation and growth.",
            linkedIn: "#",
            twitter: "#",
            picture: "/assets/about/team_2.png"

        },
        {
            name: "Jordan Lee",
            role: "Chief Technology Officer",
            description: "Jordan's expertise in software architecture ensures RateMySession remains fast, reliable, and built for scale.",
            linkedIn: "#",
            twitter: "#",
            picture: "/assets/about/team_1.png"
        }
    ];

    return (
        <section className="py-30 bg-white">
            <div className="container mx-auto max-w-7xl px-6">
                {/* Section Title */}
                <h2 className="text-4xl font-medium text-gray-800 mb-10">
                    The People Behind
                </h2>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <PeopleBehindCard key={index} person={member} />
                    ))}
                </div>





                {/* ONLY SUGEST: */}
                {/* Additional team members could be added here in a second row */}
                {/* <div className="mt-16 text-center">
                    <p className="text-lg text-gray-600 mb-6">
                        Want to join our mission to transform mental health care?
                    </p>
                    <a
                        href="/careers"
                        className="inline-flex items-center gap-2 text-amethyst-600 hover:text-amethyst-700 font-medium transition-colors"
                    >
                        View open positions
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div> */}



            </div>
        </section>
    );
}