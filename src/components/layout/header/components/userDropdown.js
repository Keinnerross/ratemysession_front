'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export function UserDropdown({ isOpen, onOpen, onClose, onCloseImmediate }) {
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    router.push('/user-profile');
  };

  const handleLogout = async () => {
    await logout();
  };

  // Get display name from user object - prioritize displayName over email
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  // Extract only the first word from the display name
  const firstName = displayName.split(' ')[0];

  // Clean email for display - remove escaped quotes
  const userEmail = user?.email?.replace(/^["']|["']$/g, '').replace(/\\"/g, '"') || 'No email';

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        onClick={onOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amethyst-100/40 hover:bg-amethyst-100/80 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-amethyst-500 flex items-center justify-center text-white text-sm font-medium">
          {displayName[0].toUpperCase()}
        </div>
        <span className="text-[15px] font-medium text-gray-900 hidden md:block">
          {firstName}
        </span>
        <FaChevronDown 
          className={`text-xs text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[280px] z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
          </div>
          
          <a
            href="/user-profile"
            onClick={(e) => {
              e.preventDefault();
              handleProfileClick();
            }}
            className="flex items-center gap-3 px-4 py-2 text-sm font-['Poppins'] text-gray-700 hover:bg-gray-50 hover:text-amethyst-600 transition-colors"
          >
            <FaUser className="text-gray-400" />
            <span>My Profile</span>
          </a>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm font-['Poppins'] text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full text-left"
            >
              <FaSignOutAlt className="text-gray-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}