'use client';

import { Logotype } from "@/components/global/brand/logo";
import { SearchbarBasic } from "@/components/global/searchbars/searchBarBasic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { default: Navigation } = require("./components/navigation");

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearch = (value) => {
        if (value.trim()) {
            router.push(`/search?q=${encodeURIComponent(value)}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <header className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
            isScrolled ? 'bg-white ' : 'bg-transparent'
        }`}>
            <div className="max-w-[1440px] w-full mx-auto flex items-center py-1">
                {/* Logo and Navigation */}
                <div className="flex items-center gap-10">
                    <Logotype />
                    <Navigation />
                </div>

                {/* Search Bar - Takes remaining space */}
                <div className="flex-1 px-8">
                    <SearchbarBasic 
                        placeholder="Search therapist..." 
                        onSearch={handleSearch}
                        className="w-full max-w-2xl mx-auto"
                    />
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-6">
                    <Link href="/login" className="relative py-2 text-gray-900 hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap group text-[15px]">
                        Log in
                        <span className="absolute bottom-0 left-0 h-0.5 bg-amethyst-600 transition-all duration-300 w-0 group-hover:w-full" />
                    </Link>
                    <Link href="/register" className="px-5 py-2.5 bg-amethyst-500 font-medium text-white rounded-xl hover:bg-amethyst-600 transition-all duration-200 hover:shadow-lg cursor-pointer whitespace-nowrap text-[15px]">Sign up</Link>
                </div>
            </div>
        </header>
    );
}
