"use client";

import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import SocialLoginButton from "./SocialLoginButton";

export default function SocialAuthButtons({ isLogin = true, onSocialAuth }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <SocialLoginButton
        provider="google"
        icon={FaGoogle}
        backgroundColor="bg-[#1a73e8]"
        iconColor="text-[#1a73e8]"
        text="Continue with Google"
        onClick={onSocialAuth}
        isLogin={isLogin}
      />
      
      <SocialLoginButton
        provider="facebook"
        icon={FaFacebook}
        backgroundColor="bg-[#3b5998]"
        iconColor="text-[#3b5998]"
        text="Continue with Facebook"
        onClick={onSocialAuth}
        isLogin={isLogin}
      />
    </div>
  );
}