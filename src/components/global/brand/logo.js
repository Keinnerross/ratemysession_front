'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

const { default: Image } = require("next/image");

export function Logotype() {
    const router = useRouter();
    
    const handleLogoClick = (e) => {
        e.preventDefault();
        // Navigate to home and explicitly clear the hash
        router.push('/');
        // Clear hash from URL
        if (window.location.hash) {
            window.history.pushState("", document.title, window.location.pathname);
        }
    };
    
    return (
        <Link href="/" onClick={handleLogoClick}>
            <div className="relative w-32 h-20">

                <Image className="object-contain" src="/assets/brand/logo.png" alt="Rate My Session Logo" fill />
            </div>

        </Link>
    );
} 