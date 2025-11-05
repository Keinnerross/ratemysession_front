import Image from "next/image";

export function PeopleBehindCard({ person }) {
    // Default values if person prop is not provided
    const defaultPerson = {
        name: "Jordan Lee",
        role: "Chief Technology Officer",
        description: "Jordan's expertise in software architecture ensures RateMySession remains fast, reliable, and built for scale.",
        linkedIn: "#",
        twitter: "#",
        picture: "/"
    };

    const data = person || defaultPerson;

    return (
        <div className="relative bg-white rounded-3xl overflow-hidden ">
            {/* Image Section */}
            <div className="relative w-full aspect-square bg-gray-200">
                {data.picture ? (
                    <Image src={data.picture} alt={data.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amethyst-100 to-amethyst-200 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm"></div>
                    </div>
                )}
            </div>
            {/* Content Section */}
            <div className="p-6 space-y-4">
                {/* Name and Role */}
                <div>
                    <h3 className="text-xl font-medium text-gray-800">{data.name}</h3>
                    <p className="text-base font-base text-gray-700">{data.role}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                    {data.description}
                </p>

                {/* Social Links */}
                <div className="flex gap-4 pt-2">
                    {/* LinkedIn */}
                    <a
                        href={data.linkedIn}
                        className="text-gray-400 hover:text-amethyst-600 transition-colors"
                        aria-label="LinkedIn profile"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>

                    {/* Twitter */}
                    <a
                        href={data.twitter}
                        className="text-gray-400 hover:text-amethyst-600 transition-colors"
                        aria-label="Twitter profile"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}