"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const { default: Image } = require("next/image");

export function Logotype() {
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    // Navigate to home and explicitly clear the hash
    router.push("/");
    // Clear hash from URL
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname);
    }
  };

  return (
    <Link href="/" onClick={handleLogoClick}>
      <div className="relative  h-20 flex items-center">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-10 h-10 bg-amethyst-500 rounded-lg"></div>
          <div className="text-lg font-semibold leading-tight text-gray-800">
            <p>Rate My</p>
            <p>Session </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
