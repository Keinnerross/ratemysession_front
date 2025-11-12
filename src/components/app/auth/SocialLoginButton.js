"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function SocialLoginButton({ 
  provider, 
  icon: Icon, 
  backgroundColor, 
  iconColor, 
  text,
  onClick,
  isLogin = true,
  onError 
}) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Send to our backend
        const result = await loginWithGoogle(userInfo);
        
        if (result.success) {
          router.push('/user-profile');
        } else {
          // Show error to user
          if (onError) {
            onError(result.message || 'Google login failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (onError) {
          onError('An error occurred. Please try again.');
        }
      }
    },
    onError: () => {
      console.error('Google login cancelled or failed');
      if (onError) {
        onError('Google login was cancelled.');
      }
    }
  });

  const handleClick = () => {
    if (provider === 'google') {
      googleLogin();
    } else {
      // TODO: Implement Facebook OAuth
      console.log(`${isLogin ? 'Login' : 'Register'} with ${provider}`);
      if (onClick) onClick(provider, isLogin);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative h-12 ${backgroundColor} flex items-center cursor-pointer hover:opacity-90 transition-opacity w-full`}
    >
      <div className="w-[47px] h-[46px] bg-white flex items-center justify-center ml-px">
        <Icon className={`${iconColor} text-xl`} />
      </div>
      <div className="flex-1 flex items-center justify-center text-white text-sm font-['Outfit'] font-normal">
        {text}
      </div>
    </button>
  );
}