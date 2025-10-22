import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function IdentityChoiceStep({ identityOption, onIdentitySelect }) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-['Outfit'] font-medium text-[#191919] text-[22px] tracking-[-0.22px] mb-1">
          Your Identity
        </h2>
        <p className="font-['Poppins'] font-light text-[#767676] text-sm">
          Choose how you'd like to submit this recommendation
        </p>
      </div>

      <div className="flex gap-6 w-full justify-center">
        <button
          onClick={() => onIdentitySelect('anonymous')}
          className={`relative w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all ${
            identityOption === 'anonymous' 
              ? 'border-[#7466f2] bg-neutral-50' 
              : 'border-[#dad6ff] hover:border-[#7466f2]'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <Image 
                src="/assets/icons-svg/others/anonymous.svg"
                alt="Anonymous"
                width={40}
                height={40}
              />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px] mb-1">
              Stay Anonymous
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
              Submit without creating an account
            </p>
          </div>
        </button>

        <button
          onClick={() => onIdentitySelect('registered')}
          className={`relative w-[220px] h-[150px] rounded-xl overflow-hidden border-2 transition-all ${
            identityOption === 'registered' 
              ? 'border-[#7466f2] bg-neutral-50' 
              : 'border-[#dad6ff] hover:border-[#7466f2]'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <FaUser className="text-4xl text-[#7466f2]" />
            </div>
            <h3 className="font-['Outfit'] font-medium text-[#424242] text-base tracking-[-0.16px] mb-1">
              Log In to Submit
            </h3>
            <p className="font-['Poppins'] font-light text-[#909090] text-xs text-center">
              Track your recommendations
            </p>
          </div>
        </button>
      </div>
    </>
  );
}