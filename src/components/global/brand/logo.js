import Link from "next/link";

const { default: Image } = require("next/image");

export function Logotype() {
    return (
        <Link href="/">
            <div className="relative w-32 h-20">

                <Image className="object-contain" src="/assets/brand/logo.png" alt="Rate My Session Logo" fill />
            </div>

        </Link>
    );
} 