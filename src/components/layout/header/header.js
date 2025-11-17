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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'therapist' | 'user' | null
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleDropdownOpen = (dropdownName) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setOpenDropdown(dropdownName);
  };

  const handleDropdownClose = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const handleDropdownCloseImmediate = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setOpenDropdown(null);
  };

  const handleSearch = (value) => {
    // Mark that we're applying a search
    if (typeof window !== "undefined") {
      sessionStorage.setItem("search-filter-applied", "true");
    }

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
      <div className="max-w-[1330px] w-full mx-auto px-4 md:px-6 lg:px-0 flex items-center ">
        {/* Logo and Navigation */}

        <div className="w-full flex items-center gap-4 md:gap-6 justify-between">
          <Logotype />
          {/* Search Bar - Hidden on mobile, visible on tablet and up */}
          <SearchbarBasic
            placeholder="Search therapist..."
            onSearch={handleSearch}
            className="py-1.5 border-amethyst-100"
          />
          {/* Desktop Navigation */}
          <div className="hidden w-fit lg:flex items-center justify-end gap-6">
            <Navigation
              isOpen={openDropdown === 'therapist'}
              onOpen={() => handleDropdownOpen('therapist')}
              onClose={handleDropdownClose}
              onCloseImmediate={handleDropdownCloseImmediate}
            />
            {!loading &&
              (user ? (
                <UserDropdown
                  isOpen={openDropdown === 'user'}
                  onOpen={() => handleDropdownOpen('user')}
                  onClose={handleDropdownClose}
                  onCloseImmediate={handleDropdownCloseImmediate}
                />
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
              ))}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
