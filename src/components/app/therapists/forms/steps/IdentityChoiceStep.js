import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function IdentityChoiceStep({ identityOption, onIdentitySelect, user }) {
  // Extract user name safely
  const getUserName = () => {
    if (!user) return null;

    // If user is a string, use it directly
    if (typeof user === 'string') return user;

    // If user is an object, check for displayName
    if (typeof user === 'object') {
      // Handle case where displayName is a nested object with displayName property
      if (user.displayName) {
        if (typeof user.displayName === 'object' && user.displayName.displayName) {
          return user.displayName.displayName;
        }
        if (typeof user.displayName === 'string') {
          return user.displayName;
        }
      }

      // Fallback to other properties
      if (user.name && typeof user.name === 'string') return user.name;
      if (user.email && typeof user.email === 'string') {
        return user.email.split('@')[0];
      }
    }

    return null;
  };

  const userName = getUserName();

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
          Your Identity
        </h2>
        <p className="font-['Poppins'] font-light text-[#767676] text-sm">
          Choose how you'd like to create your profile
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full justify-center items-center px-4 md:px-0">
        <button
          onClick={() => onIdentitySelect('anonymous')}
          className={`relative w-full md:w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all ${
            identityOption === 'anonymous'
              ? 'border-[#7466f2] bg-neutral-50'
              : 'border-[#dad6ff] hover:border-[#7466f2]'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3">
              <Image
                src="/assets/icons-svg/others/anonymous.svg"
                alt="Anonymous"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px] mb-1">
              Stay Anonymous
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
              Create profile without an account
            </p>
          </div>
        </button>

        <button
          onClick={() => onIdentitySelect('registered')}
          className={`relative w-full md:w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all ${
            identityOption === 'registered'
              ? 'border-[#7466f2] bg-neutral-50'
              : 'border-[#dad6ff] hover:border-[#7466f2]'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3">
              <FaUser className="text-3xl md:text-4xl text-[#7466f2]" />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px] mb-1">
              {userName ? `Submit as ${userName}` : "Create Account"}
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
              {userName ? "Your profile will be linked to your account" : "Manage your profile later"}
            </p>
          </div>
        </button>
      </div>
    </>
  );
}