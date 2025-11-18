export default function PrivacySection() {
    const privacySections = [
        {
            title: "1. Information Collection",
            content: [
                "Personal Information: We collect personal details such as your name, email address, and contact information when you register for an account.",
                "Usage Data: We collect information on how you interact with our services, including the types of content you view or engage with."
            ]
        },
        {
            title: "2. Use of Information",
            content: [
                "To provide and manage our services.",
                "To improve user experience.",
                "To communicate with you about account-related issues and service updates."
            ]
        },
        {
            title: "3. Data Protection",
            content: [
                "We employ industry-standard security measures to protect your information from unauthorized access, alteration, or destruction.",
                "Access to personal data is limited to authorized personnel only."
            ]
        },
        {
            title: "4. Your Rights",
            content: [
                "You have the right to access, correct, or delete your personal information.",
                "You can opt-out of receiving promotional communications at any time."
            ]
        },
        {
            title: "5. Contact Us",
            content: "For any questions or concerns about our privacy policy, please contact us through the feedback widget."
        }
    ];

    return (
        <section className="pb-20 pt-32 bg-gradient-to-b from-amethyst-50 to-white">
            <div className="container mx-auto max-w-3xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-medium text-black mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Updated 02.03.25
                    </p>
                </div>

                {/* Introduction */}
                <div className="mb-12">
                    <p className="text-xl font-medium text-black leading-relaxed">
                        Welcome to RateMySession.com. We are committed to protecting the
                        privacy and security of our users' information. This policy outlines
                        how we collect, use, and safeguard your data.
                    </p>
                </div>

                {/* Privacy Sections */}
                <div className="space-y-10">
                    {privacySections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h2 className="text-xl font-medium text-black">
                                {section.title}
                            </h2>
                            {Array.isArray(section.content) ? (
                                <ul className="space-y-2 text-gray-600 text-lg leading-relaxed">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex">
                                            <span className="mr-2">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {section.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        This Privacy Policy is effective as of the date stated above and will remain 
                        in effect except with respect to any changes in its provisions in the future.
                    </p>
                </div>
            </div>
        </section>
    );
}