"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SocialLoginButton({ 
  provider, 
  icon: Icon, 
  backgroundColor, 
  iconColor, 
  text,
  onClick,
  isLogin = true 
}) {
  const router = useRouter();

  const handleClick = () => {
    if (provider === 'google') {
      // Redirigir al flujo OAuth de Google
      const mode = isLogin ? 'login' : 'register';
      window.location.href = `/api/auth/google/authorize?mode=${mode}`;
    } else {
      // TODO: Implement Facebook OAuth
      console.log(`${isLogin ? 'Login' : 'Register'} with ${provider}`);
      if (onClick) onClick(provider, isLogin);
    }
  };

  // Botón personalizado para todos los proveedores

  // Para otros proveedores, mantener el botón personalizado
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