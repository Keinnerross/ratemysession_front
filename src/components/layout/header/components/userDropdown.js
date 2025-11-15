'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/user-profile');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Get display name from user object
  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => {
        if (dropdownTimeout) clearTimeout(dropdownTimeout);
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        const timeout = setTimeout(() => {
          setIsOpen(false);
        }, 150);
        setDropdownTimeout(timeout);
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-amethyst-500 flex items-center justify-center text-white text-sm font-medium">
          {displayName[0].toUpperCase()}
        </div>
        <span className="text-[15px] font-medium text-gray-900 hidden md:block">
          {displayName}
        </span>
        <FaChevronDown 
          className={`text-xs text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
          </div>
          
          <a
            href="/user-profile"
            onClick={(e) => {
              e.preventDefault();
              handleProfileClick();
            }}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amethyst-600 transition-colors"
          >
            <FaUser className="text-gray-400" />
            <span>My Profile</span>
          </a>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full text-left"
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