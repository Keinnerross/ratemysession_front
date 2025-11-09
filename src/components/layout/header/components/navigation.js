'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useAddTherapist } from '@/context/AddTherapistContext';

// Navigation component for the header, desktop and mobile navigation can be handled here
function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeHash, setActiveHash] = useState('');
    const [showTherapistDropdown, setShowTherapistDropdown] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);
    const dropdownRef = useRef(null);
    const { openAddTherapist } = useAddTherapist();

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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (dropdownTimeout) {
                clearTimeout(dropdownTimeout);
            }
        };
    }, [dropdownTimeout]);

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
        { name: "About us", href: "/about" },
        { name: "How it works", href: "/#how-it-works", isSection: true, hash: "#how-it-works" },
        { name: "Therapists", href: "/search" },
        // { name: "Feedback", href: "/feedback" },
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
        <nav className='whitespace-nowrap'>
            <ul className="flex gap-8 justify-between items-center flex-nowrap">
                {navStructure.map((item, i) => {
                    const isActive = item.isSection 
                        ? pathname === '/' && activeHash === item.hash
                        : pathname === item.href;
                    
                    return (
                        <li key={i} className="relative" ref={item.name === 'Therapists' ? dropdownRef : null}>
                            {item.name === 'Therapists' ? (
                                <div
                                    onMouseEnter={() => {
                                        if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                        setShowTherapistDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        const timeout = setTimeout(() => {
                                            setShowTherapistDropdown(false);
                                        }, 150);
                                        setDropdownTimeout(timeout);
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push('/search');
                                        }}
                                        className={`relative py-2 text-[15px] font-['Poppins'] font-regular transition-all duration-300 group flex items-center gap-1 ${
                                            isActive ? 'text-amethyst-600' : 'text-gray-900 hover:text-amethyst-600'
                                        }`}
                                    >
                                        {item.name}
                                        <FaChevronDown className={`text-xs transition-transform ${
                                            showTherapistDropdown ? 'rotate-180' : ''
                                        }`} />
                                        <span className={`absolute bottom-0 left-0 h-0.5 bg-amethyst-600 transition-all duration-300 ${
                                            isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`} />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {showTherapistDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg border border-gray-200 py-2 min-w-[180px] z-50 text-sm">
                                            <a
                                                href="/search"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowTherapistDropdown(false);
                                                    router.push('/search');
                                                }}
                                                className="block px-4 py-2  font-['Poppins'] text-gray-700 hover:bg-gray-50 hover:text-amethyst-600 transition-colors"
                                            >
                                                Browse Therapists
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setShowTherapistDropdown(false);
                                                    openAddTherapist();
                                                }}
                                                className="block w-full text-left px-4 py-2  font-['Poppins'] text-gray-700 hover:bg-gray-50 hover:text-amethyst-600 transition-colors"
                                            >
                                                Add Therapist
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a 
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className={`relative py-2 text-[15px] font-['Poppins'] font-regular transition-all duration-300 group ${
                                        isActive ? 'text-amethyst-600' : 'text-gray-900 hover:text-amethyst-600'
                                    }`}
                                >
                                    {item.name}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-amethyst-600 transition-all duration-300 ${
                                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
export default Navigation;