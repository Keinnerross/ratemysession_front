import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export function Footer() {
    const footerLinks = {
        legal: [
            { label: "Privacy policy", href: "/privacy-policy" },
            { label: "Terms and conditions", href: "/terms-and-conditions" },
            { label: "Cookie Policy", href: "/cookie-policy" }
        ],
        product: [
            { label: "Therapists", href: "/therapists" },
            { label: "Feedback", href: "/feedback" },
            { label: "Support", href: "/support" },
            { label: "Login", href: "/login" },
            { label: "Sign up", href: "/register" }
        ],
        about: [
            { label: "Company", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Careers", href: "/careers" }
        ]
    };

    const socialLinks = [
        { icon: "instagram", href: "#", component: FaInstagram },
        { icon: "linkedin", href: "#", component: FaLinkedinIn }
    ];

    return (
        <footer className="relative bg-white border-t border-stone-300">
            <div className="container mx-auto max-w-7xl px-6">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <Image 
                                    src="/assets/brand/logo.png" 
                                    alt="Rate My Session" 
                                    width={134} 
                                    height={44}
                                    className="h-11 w-auto"
                                />
                            </div>
                            <p className="text-stone-700 mb-6 max-w-xs">
                                Your Secret Weapon for Smarter Therapist Choices
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.component;
                                    return (
                                        <Link 
                                            key={social.icon}
                                            href={social.href}
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors group"
                                        >
                                            <span className="sr-only">{social.icon}</span>
                                            <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div>
                            <h3 className="font-semibold text-stone-800 mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href}
                                            className="text-stone-600 hover:text-amethyst-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-stone-800 mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href}
                                            className="text-stone-600 hover:text-amethyst-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-stone-800 mb-4">About</h3>
                            <ul className="space-y-3">
                                {footerLinks.about.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href}
                                            className="text-stone-600 hover:text-amethyst-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-stone-300 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Link 
                            href="/cookie-settings"
                            className="text-xs text-stone-800 underline hover:text-amethyst-600"
                        >
                            Cookie Settings
                        </Link>
                        <Link 
                            href="/cookie-policy"
                            className="text-xs text-stone-800 underline hover:text-amethyst-600"
                        >
                            Check our cookies policy to delete cookies
                        </Link>
                        <p className="text-xs text-stone-800">
                            © RateMySession
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Background Element */}
            <div className="absolute -left-80 -bottom-20 w-96 h-96 rounded-full bg-amethyst-100 opacity-20 blur-3xl pointer-events-none"></div>
        </footer>
    );
}