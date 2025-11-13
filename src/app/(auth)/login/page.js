"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SocialAuthButtons from "@/components/app/auth/SocialAuthButtons";
import PageTransition from "@/components/app/auth/PageTransition";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/user-profile');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      router.push('/user-profile');
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
    
    setLoading(false);
  };

  const handleSocialAuth = (provider, isLogin) => {
    // TODO: Implement OAuth login logic
    console.log(`Login with ${provider}`);
  };
  return (
    <PageTransition>
      <div className="lg:min-h-screen flex justify-center bg-white lg:pt-6">
        <div className="w-full max-w-[774px] py-10 sm:py-8">
          <div className="flex flex-col gap-6 sm:gap-12 lg:gap-[72px]">
            {/* Header */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-semibold text-[#191919] leading-tight sm:leading-[66px] font-['Outfit']">
                Log in
              </h1>
              
              <div className="mt-1 sm:mt-1.5 flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-sm sm:text-base lg:text-lg text-[#191919] font-['Poppins']">
                  Don't have an account?
                </span>
                <Link href="/register" className="text-sm sm:text-base lg:text-lg text-amethyst-500 font-['Poppins'] hover:underline">
                  Sign up
                </Link>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-[318px_100px_1fr] gap-6 sm:gap-8 lg:gap-0">
              {/* Left Side - Email/Password Form */}
              <div className="flex flex-col order-1 lg:order-none">
                {/* Username Field */}
                <div className="mb-6 sm:mb-8 lg:mb-[60px]">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Usuario o Email
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pb-1 sm:pb-2 border-b border-[#cacaca] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <label className="block text-sm text-[#595d70] font-['Poppins'] mb-1 sm:mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pb-1 sm:pb-2 border-b border-[#cacaca] outline-none focus:border-[#796bf5] transition-colors bg-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Forgot Email Link */}
                <Link href="/forgot-password" className="text-xs text-[#191919] underline font-['Poppins'] hover:text-[#796bf5] mb-6 sm:mb-8 lg:mb-10">
                  Forgot Email?
                </Link>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="relative w-[120px] h-[38px] sm:h-[42px] bg-white rounded-[21px] border border-[#d8d4ff] font-semibold text-[#796bf5] text-sm sm:text-base font-['Outfit'] hover:bg-[#796bf5] hover:text-white transition-colors flex items-center justify-center mx-auto lg:mx-0 disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Log In'}
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
                    isLogin={true}
                    onSocialAuth={handleSocialAuth}
                    onError={setError}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#595d70] font-['Poppins']">
              <div className="flex gap-3 sm:gap-4">
                <Link href="/privacy-policy" className="underline hover:text-[#796bf5]">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-use" className="underline hover:text-[#796bf5]">
                  Terms of Use
                </Link>
              </div>
              
              <div className="text-center px-4">
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