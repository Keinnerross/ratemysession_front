"use client";

import { Logotype } from "@/components/global/brand/logo";
import { SearchbarBasic } from "@/components/global/searchbars/searchBarBasic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const { default: Navigation } = require("./components/navigation");
import { MobileMenu } from "./components/mobileMenu";
import { UserDropdown } from "./components/userDropdown";

export function HeaderHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (value) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    } else {
      router.push("/search");
    }
  };
  // border-b border-amethyst-100
  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300   ${
        isScrolled ? "bg-white shadow-xl/2" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1650px] w-full mx-auto px-4 md:px-6 lg:px-0 flex items-center justify-between">
        {/* Logo and Navigation */}

        <div className="flex items-center gap-4 md:gap-6">
          <Logotype />
        </div>


        {/* Desktop Navigation and Auth */}
        <div className="hidden lg:flex items-center gap-6">
          <Navigation />
          {!loading && (
            user ? (
              <UserDropdown />
            ) : (
              <>
                <Link
                  href="/login"
                  className="relative py-2 text-gray-900 hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap group text-[15px]"
                >
                  Log in
                  <span className="absolute bottom-0 left-0 h-0.5 bg-amethyst-600 transition-all duration-300 w-0 group-hover:w-full" />
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-amethyst-500 font-medium text-white rounded-xl hover:bg-amethyst-600 transition-all duration-200 hover:shadow-lg cursor-pointer whitespace-nowrap text-[15px]"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
