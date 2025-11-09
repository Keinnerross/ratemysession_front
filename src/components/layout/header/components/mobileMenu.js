'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAddTherapist } from '@/context/AddTherapistContext';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTherapistSubmenu, setShowTherapistSubmenu] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const [activeHash, setActiveHash] = useState('');
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

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navStructure = [
        { name: "About us", href: "/about" },
        { name: "How it works", href: "/#how-it-works", isSection: true, hash: "#how-it-works" },
        { name: "Therapists", href: "/search", hasSubmenu: true },
    ];

    const handleNavClick = (e, item) => {
        e.preventDefault();
        
        if (item.hasSubmenu) {
            setShowTherapistSubmenu(!showTherapistSubmenu);
            return;
        }
        if (item.isSection) {
            // Close mobile menu
            setIsOpen(false);
            // If we're not on the home page, navigate there first
            if (pathname !== '/') {
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
                    window.location.hash = 'how-it-works';
                }
            }
        } else {
            // For other links, navigate normally and close menu
            setIsOpen(false);
            router.push(item.href);
        }
    };

    {/*Burger Menu and Sidebar*/}
    return (
        <>
            {/* Burger Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-amethyst-500 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <HiX size={24} /> : <HiMenu size={32} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <HiX size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="py-4">
                            {navStructure.map((item, i) => {
                                const isActive = item.isSection 
                                    ? pathname === '/' && activeHash === item.hash
                                    : pathname === item.href;

                                return (
                                    <li key={i}>
                                        {item.hasSubmenu ? (
                                            <>
                                                <button
                                                    onClick={(e) => handleNavClick(e, item)}
                                                    className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                                                        isActive ? 'text-amethyst-600 bg-amethyst-50' : 'text-gray-900 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span>{item.name}</span>
                                                    <FaChevronDown className={`text-xs transition-transform ${
                                                        showTherapistSubmenu ? 'rotate-180' : ''
                                                    }`} />
                                                </button>
                                                
                                                {/* Submenu */}
                                                {showTherapistSubmenu && (
                                                    <div className="bg-gray-50">
                                                        <a
                                                            href="/search"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setIsOpen(false);
                                                                router.push('/search');
                                                            }}
                                                            className="block px-12 py-3 text-gray-700 hover:text-amethyst-600 hover:bg-gray-100 transition-colors"
                                                        >
                                                            Browse Therapists
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                openAddTherapist();
                                                            }}
                                                            className="block w-full text-left px-12 py-3 text-gray-700 hover:text-amethyst-600 hover:bg-gray-100 transition-colors"
                                                        >
                                                            Add Therapist
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <a
                                                href={item.href}
                                                onClick={(e) => handleNavClick(e, item)}
                                                className={`block px-6 py-3 transition-colors ${
                                                    isActive ? 'text-amethyst-600 bg-amethyst-50' : 'text-gray-900 hover:bg-gray-50'
                                                }`}
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="p-6 border-t border-gray-200 space-y-3">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-3 text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-3 bg-amethyst-500 text-white rounded-xl hover:bg-amethyst-600 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}