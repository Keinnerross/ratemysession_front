export default function TermsSection() {
    const terms = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using RateMySession.com, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our services."
        },
        {
            title: "2. Description of Service",
            content: "RateMySession.com provides a platform for users to rate and review therapy sessions. We do not endorse or validate the content posted by users."
        },
        {
            title: "3. User Responsibilities",
            content: [
                "You agree to provide accurate and current information about yourself.",
                "You agree not to post any content that is unlawful, harassing, libelous, or abusive.",
                "You are responsible for maintaining the confidentiality of your account details."
            ]
        },
        {
            title: "4. Intellectual Property",
            content: [
                "Content provided by users is their own and they grant RateMySession.com a non-exclusive license to use, modify, and display such content on our platform.",
                "The design, layout, and look of RateMySession.com are protected under copyright law and may not be copied or re-used without express permission."
            ]
        },
        {
            title: "5. Limitation of Liability",
            content: "RateMySession.com is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services."
        },
        {
            title: "6. Changes to Terms",
            content: "We reserve the right to modify these terms at any time. Continued use of our services after such changes will constitute your consent to those changes."
        },
        {
            title: "7. Governing Law",
            content: "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is based."
        },
        {
            title: "8. Contact Us",
            content: "For any questions or concerns about these terms, please contact us through the feedback widget."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto max-w-3xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-medium text-black mb-2">
                        Terms and conditions
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Updated 02.03.25
                    </p>
                </div>

                {/* Introduction */}
                <div className="mb-12">
                    <p className="text-xl font-medium text-black leading-relaxed">
                        These Terms of Service ("Terms") govern your use of our
                        website, products, and services. By accessing or using Rate My
                        Session, you agree to comply with these Terms. If you do not agree,
                        please do not use the platform.
                    </p>
                </div>

                {/* Terms List */}
                <div className="space-y-10">
                    {terms.map((term, index) => (
                        <div key={index} className="space-y-4">
                            <h2 className="text-xl font-medium text-black">
                                {term.title}
                            </h2>
                            {Array.isArray(term.content) ? (
                                <ul className="space-y-2 text-gray-600 text-lg leading-relaxed">
                                    {term.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex">
                                            <span className="mr-2">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {term.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        By using RateMySession, you acknowledge that you have read, understood, 
                        and agree to be bound by these Terms and Conditions.
                    </p>
                </div>
            </div>
        </section>
    );
}