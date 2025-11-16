"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
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
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

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

  const handleFacebookSuccess = async (response) => {
    try {
      setIsFacebookLoading(true);

      // Validate email is present
      if (!response.email) {
        if (onError) {
          onError('Tu cuenta de Facebook debe tener un email público. Por favor verifica la configuración de privacidad de tu cuenta de Facebook.');
        }
        setIsFacebookLoading(false);
        return;
      }

      const facebookUserInfo = {
        id: response.id,
        email: response.email,
        name: response.name,
        picture: response.picture
      };

      const result = await loginWithFacebook(facebookUserInfo);

      if (result.success) {
        router.push('/user-profile');
      } else {
        if (onError) {
          onError(result.message || 'Facebook login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      if (onError) {
        onError('An error occurred. Please try again.');
      }
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handleFacebookFail = (error) => {
    console.error('Facebook login failed:', error);
    if (onError) {
      onError('Facebook login was cancelled or failed.');
    }
  };

  const handleClick = () => {
    if (provider === 'google') {
      googleLogin();
    } else if (provider === 'facebook') {
      // Facebook login is handled by FacebookLogin component wrapper
      // This click handler won't be used for Facebook
    } else {
      console.log(`${isLogin ? 'Login' : 'Register'} with ${provider}`);
      if (onClick) onClick(provider, isLogin);
    }
  };

  // For Facebook, wrap the button with FacebookLogin component
  if (provider === 'facebook') {
    return (
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        onSuccess={handleFacebookSuccess}
        onFail={handleFacebookFail}
        fields="name,email,picture"
        scope="public_profile,email"
        render={({ onClick: fbOnClick }) => (
          <button
            onClick={fbOnClick}
            disabled={isFacebookLoading}
            className={`relative h-12 ${backgroundColor} flex items-center cursor-pointer hover:opacity-90 transition-opacity w-full ${isFacebookLoading ? 'opacity-50' : ''}`}
          >
            <div className="w-[47px] h-[46px] bg-white flex items-center justify-center ml-px">
              <Icon className={`${iconColor} text-xl`} />
            </div>
            <div className="flex-1 flex items-center justify-center text-white text-sm font-['Outfit'] font-normal">
              {isFacebookLoading ? 'Cargando...' : text}
            </div>
          </button>
        )}
      />
    );
  }

  // For Google and other providers
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