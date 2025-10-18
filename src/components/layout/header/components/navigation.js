'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Navigation component for the header, desktop and mobile navigation can be handled here
function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeHash, setActiveHash] = useState('');

    useEffect(() => {
        // Get the initial hash
        setActiveHash(window.location.hash);

        // Listen for hash changes
        const handleHashChange = () => {
            setActiveHash(window.location.hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Reset hash when pathname changes
    useEffect(() => {
        // If we're on home page, check if we actually have a hash
        if (pathname === '/') {
            // Small delay to ensure URL is updated
            setTimeout(() => {
                setActiveHash(window.location.hash);
            }, 0);
        } else {
            // Clear hash for other pages
            setActiveHash('');
        }
    }, [pathname]);

    const navStructure = [
        { name: "About", href: "/about" },
        { name: "How it works", href: "/#how-it-works", isSection: true, hash: "#how-it-works" },
        { name: "Therapists", href: "#" },
        { name: "Feedback", href: "/feedback" },
    ];

    const handleNavClick = (e, item) => {
        e.preventDefault();
        
        if (item.isSection) {
            // If we're not on the home page, navigate there first
            if (pathname !== '/') {
                // Navigate to home with the hash
                router.push('/#how-it-works');
                setTimeout(() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // If we're already on home, just scroll
                const element = document.getElementById('how-it-works');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Update the URL with hash
                    window.location.hash = 'how-it-works';
                }
            }
        } else if (item.href === '#') {
            // For # links, just clear the hash without navigation
            window.history.pushState("", document.title, window.location.pathname);
            setActiveHash('');
        } else {
            // For other links, navigate normally
            router.push(item.href);
        }
    };

    return (
        <nav>
            <ul className="flex gap-8 justify-between">
                {navStructure.map((item, i) => {
                    const isActive = item.isSection 
                        ? pathname === '/' && activeHash === item.hash
                        : pathname === item.href;
                    
                    return (
                        <li key={i}>
                            <a 
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item)}
                                className={`relative py-2 text-base transition-all duration-300 group ${
                                    isActive ? 'text-amethyst-600' : 'text-gray-800 hover:text-amethyst-600'
                                }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-amethyst-600 transition-all duration-300 ${
                                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                }`} />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
export default Navigation;