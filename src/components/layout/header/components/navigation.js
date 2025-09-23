'use client';

import { useRouter, usePathname } from 'next/navigation';

// Navigation component for the header, desktop and mobile navigation can be handled here
function Navigation() {
    const router = useRouter();
    const pathname = usePathname();

    const navStructure = [
        { name: "About", href: "/about" },
        { name: "How it works", href: "/#how-it-works", isSection: true },
        { name: "Therapists", href: "#" },
        { name: "Feedback", href: "/feedback" },
    ];

    const handleNavClick = (e, item) => {
        if (item.isSection) {
            e.preventDefault();
            
            // If we're not on the home page, navigate there first
            if (pathname !== '/') {
                // Navigate to home with the hash
                router.push('/?scrollTo=how-it-works');
            } else {
                // If we're already on home, just scroll
                const element = document.getElementById('how-it-works');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <nav>
            <ul className="flex gap-4 justify-between">
                {navStructure.map((item, i) => (
                    <li key={i}>
                        <a 
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className="hover:text-amethyst-600 transition-colors"
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
export default Navigation;