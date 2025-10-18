"use client";

import React from "react";
import Link from "next/link";
import SocialAuthButtons from "@/components/app/auth/SocialAuthButtons";
import PageTransition from "@/components/app/auth/PageTransition";

export default function LoginPage() {
  const handleSocialAuth = (provider, isLogin) => {
    // TODO: Implement OAuth login logic
    console.log(`Login with ${provider}`);
  };
  return (
    <PageTransition>
      <div className="min-h-screen flex justify-center bg-amethyst-50 pt-10">
        <div className="w-[774px] max-w-full px-4 py-8">
          <div className="flex flex-col gap-[72px]">
          {/* Header */}
          <div className="flex flex-col items-center">
            <h1 className="text-[56px] font-semibold text-[#191919] leading-[66px] font-['Outfit']">
              Log in
            </h1>
            
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-lg text-[#191919] font-['Poppins']">
                Don't have an account?
              </span>
              <Link href="/register" className="text-lg text-amethyst-500 font-['Poppins'] hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* Form Section */}
          <div className="h-[277px] grid grid-cols-[318px_100px_1fr] gap-0">


            {/* Left Side - Email/Password Form */}
            <div className="flex flex-col">
              {/* Email Field */}
              <div className="mb-[60px]">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full pb-2 border-b border-[#cacaca] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-sm text-[#595d70] font-['Poppins'] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full pb-2 border-b border-[#cacaca] outline-none focus:border-[#796bf5] transition-colors bg-transparent"
                />
              </div>

              {/* Forgot Email Link */}
              <Link href="/forgot-password" className="text-xs text-[#191919] underline font-['Poppins'] hover:text-[#796bf5] mb-10">
                Forgot Email?
              </Link>

              {/* Login Button */}
              <button className="relative w-[120px] h-[42px] bg-white rounded-[21px] border border-[#d8d4ff] font-semibold text-[#796bf5] text-base font-['Outfit'] hover:bg-[#796bf5] hover:text-white transition-colors flex items-center justify-center">
                Log In
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
                  isLogin={true}
                  onSocialAuth={handleSocialAuth}
                />
              </div>
            </div>



          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-1.5 text-xs text-[#595d70] font-['Poppins']">
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="underline hover:text-[#796bf5]">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="underline hover:text-[#796bf5]">
                Terms of Use
              </Link>
            </div>
            
            <div className="text-center">
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