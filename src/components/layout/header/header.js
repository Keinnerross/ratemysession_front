'use client';

import { Logotype } from "@/components/global/brand/logo";
import { useState, useEffect } from "react";

const { default: Navigation } = require("./components/navigation");

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <header className={`fixed left-0 top-0 z-50 w-screen transition-all duration-300 ${
            isScrolled ? 'bg-white ' : 'bg-transparent'
        }`}>
            <div className="max-w-[1280px] mx-auto flex justify-between items-center">
                <section className="flex gap-16 items-center">
                    <Logotype />
                    <Navigation />
                </section>

                <section className="flex items-center gap-4">
                    <a>Log in</a>
                    <a className="px-4 py-2 bg-amethyst-500 font-medium text-white rounded-xl">Sign up</a>
                </section>
            </div>
        </header>
    );
}
