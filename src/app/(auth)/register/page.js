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
      <div className="min-h-screen flex justify-center bg-amethyst-50 pt-10">
        <div className="w-[800px] max-w-full px-4 py-8">
          {/* Main Container */}
          <div className="flex flex-col gap-[72px]">
          {/* Header */}
          <div className="flex flex-col items-center">
            <h1 className="text-[56px] font-semibold text-[#191919] leading-[66px] font-['Outfit']">
              Sign Up
            </h1>
            
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-lg text-[#191919] font-['Poppins']">
                Already have an account?
              </span>
              <Link href="/login" className="text-lg text-[#796bf5] font-['Poppins'] hover:underline">
                Log In
              </Link>
            </div>
          </div>

          {/* Form Section */}
          <div className="h-[354px] grid grid-cols-[320px_100px_1fr] gap-0">
            {/* Left Side - Registration Form */}
            <div className="flex flex-col">
              {/* Email Field */}
              <div className="mb-8">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full pb-2 border-b border-[#796bf5] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Confirm Email Field */}
              <div className="mb-8">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Confirm email
                </label>
                <input
                  type="email"
                  className="w-full pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Choose a password
                </label>
                <input
                  type="password"
                  className="w-full pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-8">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="w-full pb-2 border-b border-[#dfe5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Sign Up Button */}
              <button className="w-[120px] h-[42px] bg-white rounded-[21px] border border-[#d8d4ff] font-semibold text-[#7466f2] text-base font-['Outfit'] hover:bg-[#7466f2] hover:text-white transition-colors flex items-center justify-center">
                Sign Up
              </button>
            </div>

            {/* Center Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-px bg-[#e0e5eb] opacity-80 self-stretch"></div>
              <span className="absolute bg-gray-50 px-2 text-[13.7px] text-[#20303c] font-['Poppins']">
                or
              </span>
            </div>

            {/* Right Side - Social Login */}
            <div className="flex items-center justify-center">
              <div className="mr-[60px]">
                <SocialAuthButtons 
                  isLogin={false}
                  onSocialAuth={handleSocialAuth}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-1.5 text-xs text-[#595d70] font-['Poppins'] pt-20">
            <div className="text-center">
              <p className="text-[11.8px]">
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
            
            <div className="text-center ">
              <p>
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