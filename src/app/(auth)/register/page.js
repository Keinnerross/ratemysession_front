"use client";

import React from "react";
import Link from "next/link";
import SocialAuthButtons from "@/components/app/auth/SocialAuthButtons";
import PageTransition from "@/components/app/auth/PageTransition";

export default function RegisterPage() {
  const handleSocialAuth = (provider, isLogin) => {
    // TODO: Implement OAuth registration logic
    console.log(`Register with ${provider}`);
  };
  return (
    <PageTransition>
      <div className="lg:min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-[800px]  sm:py-8">
          {/* Main Container */}
          <div className="flex flex-col gap-6 sm:gap-12 lg:gap-[72px]">
            {/* Header */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-semibold text-[#191919] leading-tight sm:leading-[66px] font-['Outfit']">
                Sign Up
              </h1>
              
              <div className="mt-1 sm:mt-1.5 flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-sm sm:text-base lg:text-lg text-[#191919] font-['Poppins']">
                  Already have an account?
                </span>
                <Link href="/login" className="text-sm sm:text-base lg:text-lg text-[#796bf5] font-['Poppins'] hover:underline">
                  Log In
                </Link>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-[320px_100px_1fr] gap-6 sm:gap-8 lg:gap-0">
              {/* Left Side - Registration Form */}
              <div className="flex flex-col order-1 lg:order-none">
                {/* Email Field */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full pb-1 sm:pb-2 border-b border-[#796bf5] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Confirm Email Field */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Confirm email
                  </label>
                  <input
                    type="email"
                    className="w-full pb-1 sm:pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Password Field */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Choose a password
                  </label>
                  <input
                    type="password"
                    className="w-full pb-1 sm:pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-5 sm:mb-6 lg:mb-8">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="w-full pb-1 sm:pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Sign Up Button */}
                <button className="w-[120px] h-[38px] sm:h-[42px] bg-white rounded-[21px] border border-[#d8d4ff] font-semibold text-[#7466f2] text-sm sm:text-base font-['Outfit'] hover:bg-[#7466f2] hover:text-white transition-colors flex items-center justify-center mx-auto lg:mx-0">
                  Sign Up
                </button>
              </div>

              {/* Center Divider - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex relative items-center justify-center order-2">
                <div className="w-px bg-[#e0e5eb] opacity-80 self-stretch"></div>
                <span className="absolute bg-white px-2 text-[13.7px] text-[#20303c] font-['Poppins']">
                  or
                </span>
              </div>

              {/* Mobile Divider - Shown on mobile, hidden on desktop */}
              <div className="lg:hidden flex items-center gap-3 sm:gap-4 order-2 my-1 sm:my-2">
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
                <span className="text-xs sm:text-[13.7px] text-[#20303c] font-['Poppins'] px-1 sm:px-2">
                  or
                </span>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Right Side - Social Login */}
              <div className="flex items-center justify-center lg:justify-start order-3">
                <div className="w-full max-w-[320px] lg:max-w-none lg:mr-[60px]">
                  <SocialAuthButtons 
                    isLogin={false}
                    onSocialAuth={handleSocialAuth}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs text-[#595d70] font-['Poppins'] pt-0 sm:pt-8">
              <div className="text-center">
                <p className="text-[9px] sm:text-[11.8px] px-4">
                  * By signing up, you agree to our{" "}
                  <Link href="/terms-of-use" className="underline hover:text-[#796bf5]">
                    Terms of Use
                  </Link>
                  {" "}and acknowledge you've read our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-[#796bf5]">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              
              <div className="text-center px-4">
                <p className="text-[9px] sm:text-xs">
                  This site is protected by reCAPTCHA Enterprise.{" "}
                  <Link href="https://policies.google.com/privacy" className="underline hover:text-[#796bf5]">
                    Google's Privacy Policy
                  </Link>
                  {" "}and{" "}
                  <Link href="https://policies.google.com/terms" className="underline hover:text-[#796bf5]">
                    Terms of Service
                  </Link>
                  {" "}apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}